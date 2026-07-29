# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is a two-app monorepo (not currently a git repo) with no shared root package.json:

- `katy-backend/` — Express REST API (CommonJS, Node 20)
- `katy-frontend/` — React 19 + Vite SPA. A single app serving two audiences on one route tree: the public marketing site at `/` and friends, and the admin CRM at `/admin/*` (see Frontend notes below).
- `katy-project-scope-v1.1.md` — the client's product/scope spec. Read this for business context (service types, CRM modules, proposal engine, reminder system, agent network) before implementing new features — it explains *why* the schema and API are shaped the way they are.

Each app has its own `node_modules` and must be worked on from within its own directory.

## Commands

### Backend (`katy-backend/`)
```
npm run dev          # nodemon index.js — runs on PORT (default 4000)
npm start             # node index.js
npm run db:migrate    # psql $DATABASE_URL -f db/schema.sql   (Postgres/Supabase only)
npm run db:seed       # psql $DATABASE_URL -f db/seed_client_intake.sql
```
There are no automated tests configured for the backend.

### Frontend (`katy-frontend/`)
```
npm run dev       # vite dev server
npm run build     # vite build
npm run lint      # oxlint
npm run preview   # preview production build
```
There are no automated tests configured for the frontend.

## Backend architecture

Standard route → controller → `pool.query` layering, no ORM:
- `routes/*.js` map HTTP verbs/paths to controller functions, mounted in `index.js` under `/api/<resource>`.
- `controllers/*.js` contain all business logic and raw parameterized SQL (`$1, $2, ...` placeholders), written directly against `pool` from `config/db.js`.
- `services/` holds cross-cutting integrations: `brevoService.js` (transactional email) and `templateRenderer.js` (`{{variable}}` substitution for proposal HTML templates).

The API is split into three mount groups in `index.js`:
- `/api/auth/*` — `POST /login` (email + password from env vars, returns a JWT) and `GET /me` (validates a token). See Auth below.
- `/api/{leads,properties,tenants,agents,reports,proposals,reminders}` — the internal admin CRM API, gated by `requireAuth` (or `requireAuthOrCron` for `/api/reminders`).
- `/api/public/*` — the public website API (`publicController.js`), unauthenticated: published property listings, renovation portfolio, the shared lead-inquiry form used across all landing pages, and agent applications. Always filters on `is_published = true` for properties.

`/api/business-profile` is a special case: `GET` is unauthenticated (mounted without `requireAuth` in `index.js`) because the **public** marketing site reads it directly for its social-proof stats sections (years in business, properties managed, etc. — see Public site content below); only `PATCH` is gated, and that gate lives inside `routes/businessProfile.js` itself rather than at the `index.js` mount level. If you're tempted to wrap the whole `/api/business-profile` mount in `requireAuth` again, don't — it'll 401 the public homepage/about/service pages silently (this happened once already).

Renovation and titling job tracking (`renovation_jobs` / `titling_jobs`) lives inside `routes/properties.js` as property-scoped sub-resources, not their own top-level mount: `POST /api/properties/:id/renovation-jobs`, `PATCH /api/properties/renovation-jobs/:id`, `POST /api/properties/:id/titling-jobs`, `PATCH /api/properties/titling-jobs/:id`, `PATCH /api/properties/titling-jobs/:id/checklist` (replaces the full checklist array — there's no per-item toggle endpoint, the frontend sends the whole array back). All of these inherit `/api/properties`'s `requireAuth` gate. `GET /api/properties/:id` returns `renovation_jobs` and `titling_jobs` arrays alongside `photos`.

### Auth (Phase 1: single admin user)

There's no `users` table — Phase 1 is Katy-only, per the scope doc. `middleware/auth.js` checks credentials against `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (constant-time compared) and issues a JWT signed with `JWT_SECRET` (7-day expiry). `requireAuth` verifies the `Authorization: Bearer <token>` header on every admin route. `/api/reminders/run` uses `requireAuthOrCron` instead, since it's meant to be hit by an external scheduler (Render Cron / Supabase Scheduled Function) rather than a logged-in browser — that scheduler must send an `x-cron-secret` header matching `CRON_SECRET`.

These env vars (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `CRON_SECRET`) are required for the backend to start meaningfully — see `.env.example`. A local `.env` with dev values already exists and is gitignored.

If this ever grows beyond one admin user (agent/staff logins, per the scope doc's Phase 2 "Agent login portal"), this whole scheme should be replaced with a real `users` table + password hashing rather than extended in place.

### Database: dual Postgres/SQLite backend

`config/db.js` is the key file to understand before touching any query. In production (`DATABASE_URL` set) it's a real `pg.Pool` against Supabase Postgres. When `DATABASE_URL` is unset, it transparently falls back to a local SQLite database (`node:sqlite`, file at `db/katy_local.db`) that auto-initializes from `db/sqlite_schema.sql` + `db/sqlite_seed.sql` on first run, and exposes the *same* `pool.query()` / `pool.connect()` interface.

This means controller code is written once against Postgres syntax and is transparently rewritten for SQLite by a regex-based `translateSql()` shim inside `config/db.js`. That shim currently only handles the specific patterns actually used in the controllers today:
- `to_char(col, 'YYYY-MM')` → `strftime('%Y-%m', col)`
- the specific `(CURRENT_DATE + ($n * INTERVAL '1 day'))::date` shape used in `remindersController.js`
- the specific `due_date + (COALESCE(...) * INTERVAL '1 day') < CURRENT_DATE` shape used in `tenantsController.js`
- `$n = ANY(array_col)` → `EXISTS (SELECT 1 FROM json_each(...) WHERE value = $n)`
- generic `::type` cast stripping and `$n` → `?` placeholder conversion

**If you write a new query using Postgres-specific syntax that doesn't match one of these patterns (arrays, JSONB operators, other date arithmetic, CTEs with Postgres-only features, etc.), it will run fine against real Postgres but silently fail or error against the local SQLite fallback.** Either keep new SQL within the already-translated patterns, or add a corresponding `translateSql()` rule, and update `db/sqlite_schema.sql` to mirror any schema change made in `db/schema.sql` (enums become `TEXT`, `UUID` becomes `TEXT` with `gen_random_uuid()`, `BOOLEAN` becomes `INTEGER`, arrays become JSON text columns, etc. — see the existing diffs between the two schema files for the established convention).

`db/schema.sql` is the source-of-truth Postgres schema (enums, UUID PKs via `gen_random_uuid()`, `TIMESTAMPTZ`, array columns, and three reporting views: `v_dashboard_summary`, `v_lead_source_attribution`, `v_revenue_by_service`). `db/sqlite_schema.sql` is the hand-maintained SQLite equivalent — the two must be kept in sync manually.

### Core domain model

Services offered map to a single `service_type` enum (`rentals`, `buy_sell`, `renovations`, `titling`, `agents`) that threads through leads, proposals, and email templates. Key entity relationships:
- `clients` — people; referenced by `leads` and `tenants`.
- `leads` — the CRM pipeline entity (stages: `new → contacted → qualified → proposal_sent → closed/lost`), tagged with `service`, optionally linked to a `property_id` and referring `agent_id`. All lead mutations also insert into `lead_activity` as an audit trail.
- `properties` — listings; `is_published` gates public-site visibility. `rental_term` and `rate` are dual-purpose (rate = rent or sale price depending on context).
- `tenants` / `payments` / `reminder_log` — active leases and rent collection. `reminder_schedule` (array of `reminder_type`) plus `OFFSET_DAYS` in `remindersController.js` drive which reminder emails fire relative to `due_date`. `GET /api/tenants/late` flags payments past their grace period; `GET /api/tenants/renewals?days=90` (default 90) flags tenants whose `lease_end` falls within the window — both compute their date boundaries in JS and pass plain date strings as query params rather than using `CURRENT_DATE`/`INTERVAL` SQL, specifically to avoid needing another `translateSql()` rule. The admin Property Detail page also shows the property's current tenant(s) by client-side filtering `GET /api/tenants` on `property_id` (there's no server-side filter for this — same pattern `AgentDetail.jsx` uses to find one agent out of the full list).
- `agents` — referral network; `commissions` tracks payouts tied to closed leads.
- `renovation_jobs` / `titling_jobs` — service-specific job tracking, FK'd to both `properties` and `leads`. Tracked per-property on the admin Property Detail page (`RenovationJobsSection` / `TitlingJobsSection`). `renovation_jobs.status` is free-text but conventionally one of `in_progress`/`complete`/`on_hold`; `titling_jobs.milestone` is genuinely free-text (seed data uses values like `tax_clearance_pending` with no fixed set), and `titling_jobs.checklist` is a JSON array of `{ item, done }` — SQLite stores it as a TEXT column but `config/db.js`'s `autoParseJSON` transparently parses it back into an array on read, same as it does for `reminder_schedule`.
- `business_profile` — a singleton row (`id` constrained to `1`) holding Katy's company-level intake answers. Read by both the admin CRM and the public site (see Auth section above) — don't assume it's admin-only data.

### Proposal & reminder email flow

Both proposal sending (`proposalsController.js`) and rental reminders (`remindersController.js`) follow the same shape: look up the record → render an HTML template via placeholder substitution → send via `brevoService.sendEmail` → log the send (update `leads`/`lead_activity`, or insert `reminder_log`). `brevoService.sendEmail` falls back to logging a mock email to the console when `BREVO_API_KEY` is unset/placeholder — this is intentional for local dev and lets email flows be exercised without real credentials.

`services/templateRenderer.js` maps each `service_type` to a proposal template file (`templates/katy-proposal-<service>.html`) — **these template files do not exist yet in `templates/`** (only `rental-reminder.html` is present); adding proposal-sending features for a service requires creating its template first.

`remindersController.js#runDailyReminders` (`GET /api/reminders/run`) is designed to be invoked by an external daily cron trigger (Render Cron Job or Supabase Scheduled Function), not by an in-process scheduler.

## Frontend notes

`katy-frontend` started from `create-vite` (React + JS, not TS — `@types/react` is present for editor support only). Tailwind CSS v4 is wired up via the `@tailwindcss/vite` plugin (see `vite.config.js` and the single `@import "tailwindcss";` in `src/index.css` — there is no `tailwind.config.js`, v4 doesn't need one for this setup). `lucide-react` is pinned to `^1.23.0`, a version that has **dropped brand icons** (`Facebook`, `Instagram`, etc. don't exist) — check `node_modules/lucide-react` exports before using an icon name from memory/training data, or the build will fail with `MISSING_EXPORT`.

The backend base URL is configurable via `VITE_API_URL` (`src/lib/api.js`), defaulting to `http://localhost:4000`.

### Route split: public site vs. admin CRM

Both live in one `App.jsx` route tree:
- `/`, `/rentals`, `/buy-sell`, `/renovations`, `/titling`, `/agents`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/rebooking-refund-policy` — public marketing site, wrapped in `components/public/PublicLayout.jsx` (header/nav + footer). Pages live in `pages/public/`, shared building blocks (`Hero`, `LeadForm`, `PropertyGrid`, `SocialProof`, `SectionHeading`, `StatBlock`) in `components/public/`.
- `/admin/login` (public) and `/admin/*` (gated by `RequireAuth`) — the CRM dashboard, wrapped in `components/AdminLayout.jsx` (sidebar nav). Pages live in `pages/{leads,properties,tenants,agents}/` plus `pages/Dashboard.jsx` and `pages/admin/Login.jsx`.

`components/RequireAuth.jsx` checks for a token in `localStorage` (via `lib/auth.js`) and re-validates it against `GET /api/auth/me` on mount; on failure it clears the session and redirects to `/admin/login`. **Don't call `navigate()` during render** to guard a route (e.g. in `Login.jsx`'s "already logged in" case) — React Router will warn about a setState-during-another-component's-render; use a declarative `<Navigate />` element instead.

`lib/api.js`'s `request()` helper attaches the stored JWT as `Authorization: Bearer <token>` automatically and clears the session on any `401` — individual API calls don't need to think about auth.

### Brand palette

Defined once as Tailwind v4 theme tokens in `src/index.css` (`@theme { --color-brand-50 … --color-brand-800 }`) — a cream-to-crimson family lifted from a client-supplied swatch: cream `#fff8f1` and peach `#fce9d2` (the two pastel tones, `brand-50`/`brand-100`, used for backgrounds — both public site and admin now share one flat cream page background, no gradient), apricot `#f6ce8e` (`brand-300`, a muted blend for icon accents on light backgrounds), and a crimson family — `brand-600` (`#e31e3b`) for buttons/links/interactive accents, `brand-700` (`#b8142e`, darker, used for hover states) and `brand-800` (`#2b1014`, a near-black derived from the red rather than a swatch color, used as the primary body-text color) for contrast/legibility the swatch's four bands don't supply on their own — none of the four source colors are dark enough to pass text contrast against the cream background, so `brand-800` was hand-picked to fill that gap the same way `brand-300` already was. Every component uses `brand-*` utility classes (`bg-brand-600`, `text-brand-700`, etc.) — there is no hardcoded hex anywhere else, so a future palette change is a one-file edit to the `@theme` block. The palette has been swapped this way three times now (navy/cream → slate/ink/mint/cream → cream/peach/apricot/crimson) without touching a single component file — keep it that way.

### Neumorphism

The whole UI (public site + admin) uses a neumorphism treatment: soft "extruded from the same material" surfaces built from a dual box-shadow (a light highlight + a dark ink-tinted shadow) instead of borders or a contrasting card color, defined as CSS utility classes in `src/index.css` (`@layer utilities`) rather than per-component inline shadows. The class names were kept as `.clay*` (not renamed to `.neu*`) when this replaced the prior claymorphism system, specifically so the ~50 existing call sites across every component didn't need touching — the site-wide look changed via one file:
- `.clay` — resting/raised surface (cards, panels, modals, images). Big radius, soft shadow all around.
- `.clay-sm` — same idea, lighter shadow, for smaller elements (feature-list tiles, stat tiles, alert/placeholder banners).
- `.clay-btn` — interactive raised surface with hover (shadow tightens) and active (shadow inverts to inset + slight `translateY`, reads as "pressed") states. Used on every button/toggle-pill.
- `.clay-field` — recessed surface (inset shadow only) — inputs, selects, textareas, segmented-control tracks, and "selected/active" nav states all use this so they read as *pushed into* the page rather than sitting on top of it. Sets its own `background-color: var(--color-brand-50)` directly (the one `.clay*` class that owns its background rather than relying on a `bg-*` utility on the element), which is why `.clay-field` usages in JSX never carry a `bg-*` class.

Unlike the claymorphism system this replaced, neumorphism only reads correctly when a surface's own background **matches** the page background — the shadow alone has to sell the illusion of being molded from the same material, not a contrasting card floating on a colored page. That's why `body` (`index.css`) is a flat `brand-50`, not a gradient, and why every other `.clay`/`.clay-sm`/`.clay-btn` surface in JSX pairs with `bg-brand-50` rather than `bg-white` (~50 call sites were migrated from `bg-white` to `bg-brand-50` when this changed — if you add a new clay surface, match that, don't reach for `bg-white`). The semantic alert-banner colors (`bg-rose-50`, `bg-emerald-50`, `bg-amber-50` on `.clay-sm` banners) are the deliberate exception — those stay their semantic color, not brand-50, since they're meaningfully success/warning/error, not a neutral card. Table-row hover/header shading (`bg-gray-50` inside `<tr>`/`<thead>`) and other neutral-gray micro-interactions (button hover states, status pills) were also intentionally left alone; those are small in-table/in-control accents, not page-level surfaces, and don't need the brand treatment.

When adding new UI: reach for `clay`/`clay-sm` + `bg-brand-50` on any new card-like container, `clay-btn` on any new button, `clay-field` on any new form input — don't hand-roll a new `border` + `shadow-*` combo or introduce a `bg-white` surface, or it'll visually clash with everything else.

### Typography

Two Google Fonts loaded via `<link>` tags in `index.html` (not self-hosted, not npm packages): **Fraunces** (a display serif) for headlines/eyebrows, **Inter** for everything else. Applied via a hand-rolled `.font-display` utility class in `index.css` (also tightens `letter-spacing`), *not* Tailwind's `@theme --font-*` token mechanism — that would auto-generate a `font-display`/`font-sans` utility with the same names and silently fight the custom one. If another font pairing is ever needed, change the `<link>` href and the `--katy-font-display` / `--katy-font-sans` custom properties in `index.css`; don't add `--font-*` keys to the `@theme` block.

### Motion (framer-motion + Lenis)

`framer-motion` was already a dependency but unused until this pass. Three shared primitives in `src/components/motion/`:
- `Reveal` — wraps a section in a fade+slide-up that fires once when scrolled into view (`whileInView`, `viewport={{ once: true }}`). Use around any `SectionHeading` + its content.
- `StaggerGroup` / `StaggerItem` — same idea but staggers children in sequence (grids of feature tiles, bento cards, checklists). `StaggerGroup` takes the `className` for the grid/flex container; wrap each child in `StaggerItem`.
- `AnimatedCounter` — counts up the leading number in a stat string (`"28+"` → animates 0→28, then appends `+`) when scrolled into view; renders non-numeric values (`"Metro Manila"`) as static text. Used inside `StatBlock`.

Site-wide inertia/momentum scrolling is separate from the above and lives in `SmoothScroll` (`src/components/motion/SmoothScroll.jsx`), wrapping `<App />` inside `<BrowserRouter>` in `main.jsx` (it needs `useLocation`, so it must stay inside the router). It wraps the `lenis` package, applies to the whole route tree (public site + admin, since both share one `App.jsx` route tree), and does two things: runs Lenis's `raf` loop to smooth native scrolling, and resets scroll to top on every route change (React Router doesn't do this on its own — without it, navigating to a new page would leave you scrolled to wherever the previous page was). It's skipped entirely under `prefers-reduced-motion: reduce`, falling back to native instant scrolling. Because Lenis smooths the *real* `scrollTop` rather than faking scroll position, it doesn't fight with `whileInView`/`IntersectionObserver` — the `Reveal`/`StaggerGroup` primitives above keep working unmodified.

**Testing/screenshotting gotcha:** Playwright's `fullPage: true` screenshot resizes the viewport to the full document height and captures in one pass — this happens *before* `whileInView`'s `IntersectionObserver` callbacks fire for content that was below the fold, so anything wrapped in `Reveal`/`StaggerGroup` renders as an invisible (opacity-0) gap in a `fullPage` screenshot even though it displays correctly for a real scrolling user. Verify motion-heavy pages with real incremental scrolling (`page.mouse.wheel(0, N)` + a normal viewport screenshot) instead of `fullPage`, or you'll chase a phantom "missing section" bug that isn't one.

### Responsive design

The public `Header` switches from the full nav to the hamburger menu at `lg:` (1024px), not the more common `md:` (768px) — with 8 nav links (Home + 5 services + About + Contact) plus the logo and a CTA button, `md:` genuinely overflows at tablet widths (confirmed: "Buy & Sell" wrapped to 3 lines and the CTA button clipped off-screen at 768px). If more nav links are ever added, re-check this breakpoint rather than assuming `lg:` has permanent headroom.

`AdminLayout` is a mobile drawer below `lg:` (hamburger + slide-in `motion.aside` with a backdrop) and a static sidebar at `lg:` and above — the sidebar used to be a non-collapsible fixed 240px column with no mobile handling at all, which made the entire admin CRM unusable on a phone (sidebar alone ate ~65% of a 375px screen). All admin `<table>` elements are wrapped in their own `overflow-x-auto` div (nested inside the `overflow-hidden` `.clay` rounded container — the two can't be the same element, `overflow-hidden` would clip the scroll) with `min-w-[640px]` on the `<table>` itself so columns don't get artificially squeezed. Modals (`components/Modal.jsx`) cap at `max-h-[90vh]` with an internal `overflow-y-auto` body so long forms don't overflow the viewport on short screens. Fixed-column form grids (`grid-cols-2`/`grid-cols-3`) were changed to start at `grid-cols-1` and step up via `sm:`/`md:` — a bare `grid-cols-2` never stacks on a narrow phone.

### Stock photography placeholders

`src/lib/stockPhotos.js` centralizes Unsplash placeholder URLs (`STOCK_PHOTOS.home`, `.rentals`, `.buySell`, `.renovations`, `.titling`, `.agents`, `.about`) used in each page's `Hero`. These are real, working image URLs (verified reachable, and visually checked to match their subject) standing in for real photography — swap this one file when real assets arrive rather than hunting through each page. `Hero` accepts an `image`/`imageAlt` prop pair; omit both to fall back to its icon-on-gradient `visual` prop.

Separately, `property_photos` seed data already has real Unsplash URLs for most properties (not placeholders in the same sense — these represent what *would* be real listing photos). `GET /api/public/properties` exposes the first one per property as `photo_url` (via a correlated subquery, `ORDER BY sort_order LIMIT 1` — deliberately avoiding a `JOIN`, which would multiply rows for multi-photo properties); `PropertyCard` renders it when present and falls back to an icon otherwise (some seeded properties, like "Modern Family Home", have zero photos on purpose, to exercise that fallback). `GET /api/public/renovations` similarly joins `renovation_jobs` to `property_photos` — that query returns **one row per photo**, not one per job, so keying a list on `job_id` will collide (use `photo_id` — this exact bug shipped once already, dormant until a job's status was set to `'complete'` made the query start returning rows).

### Public site content and pending client data

Real estate photos, testimonials, and logo are all in the scope doc's "pending from client" list — the public site was built to degrade gracefully without them: the renovations portfolio shows an empty state when `/api/public/renovations` returns `[]`, and the homepage/service-page "social proof" stats pull real numbers from `GET /api/business-profile` rather than fabricated testimonials. Privacy Policy and Terms of Service pages are explicitly marked as placeholders pending legal review. When real photos/copy/testimonials arrive, `stockPhotos.js` and `PropertyCard`'s icon fallback are the places to swap them in.

Linting uses oxlint (not ESLint), configured in `.oxlintrc.json` with the `react` and `oxc` plugins.
