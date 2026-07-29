# Project Scope
## Katy Property Solutions — Full Digital System Build

**Prepared by:** Akie (Nadine Kate Limjoco) — Marketing Operations Specialist
**Prepared for:** Katy Property Solutions
**Document version:** v1.1
**Date:** July 2026 (updated after client questionnaire — Jun 26, 2026 submission)
**Status:** Partial client discovery received — pricing, branding, and media still pending

---

## 1. Project Overview

This document outlines the full scope of work for the Katy Property Solutions digital system build — a one-stop-shop platform covering a public-facing website, an admin CRM dashboard, automated proposal delivery, tenant rental reminders, and an agent distribution network.

The system is designed to generate leads from 5 distinct service lines, convert them through structured pipelines, and allow Katy to manage every aspect of her property business from a single admin interface.

---

## 2A. Confirmed Business Profile (from client questionnaire, Jun 26 2026)

Katy was asked to skip any question she wasn't sure of yet — the following is what she confirmed. Everything not listed here (pricing, branding, media) is still open; see Section 12.

**Business:** Katherine Limjoco Quiñones — Property Management, 4 years in business.

| Service line | Confirmed sub-services |
|---|---|
| Rentals | Tenant placement, lease management, rent collection, property maintenance coordination, eviction support |
| Buy & Sell | Buyer representation, seller representation, comparative market analysis, offer negotiation, open house support |
| Renovations | Project management, budget planning, vendor coordination, site visits, permit coordination, design consultation |
| Titling | Title search, deed preparation, document filing, notarization coordination, compliance review |
| Agent Sourcing | Agent recruitment, agent screening, commission split setup, referral matching |

**Current lead sources:** Website, phone calls, email inquiries, social media, referrals, walk-ins, property portals, open houses.

**Current lead intake methods:** Web form, phone call, email, text message, walk-in, referral, social media.

**Required lead fields (Katy's request — now built into the lead capture form):** Name, phone, email, property interest, budget, move-in date, current address.

**Preferred contact method for leads:** Any.

**Scale:** ~12 active listings, ~28 properties managed.

**Agent network:** Katy already works with 7 agents (one confirmed role: Listing Agent). Individual agent names/contacts were not provided yet — these are seeded as placeholder roster slots pending real details.

---

## 2. Goals

- Generate qualified leads per service through dedicated landing pages
- Automate proposal delivery to clients and tenants
- Give Katy full visibility of her pipeline, properties, tenants, and agents in one place
- Build a commission-only agent network that multiplies her reach at zero overhead
- Establish a marketing and advertising infrastructure tied to each service

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Node.js 20 + Express.js |
| Database | Supabase (PostgreSQL via pg Pool) |
| Hosting — Frontend | Vercel |
| Hosting — Backend | Render |
| Email delivery | Brevo (transactional + marketing) |
| Domain | TBD — pending client confirmation |

---

## 4. Website — Public Facing

### 4.1 Homepage

- Hero section with headline, subtext, and primary CTA
- Services grid linking to all 5 service landing pages
- Social proof section (testimonials, client count)
- About Katy section
- Contact / inquiry form
- Footer with social links, contact details, and navigation

### 4.2 Service Landing Pages (5 pages)

Each page follows a shared 5-section template:
**Hero → Features & Process → Listings / Portfolio → Social Proof → Lead Form**

| Page | URL Slug | Service | Income Type |
|---|---|---|---|
| Rentals | /rentals | Short-term & long-term rentals | Recurring monthly |
| Buy & Sell | /buy-sell | Property buying and selling | Commission on sale |
| Renovations | /renovations | Interior & exterior renovations | Project fee + markup |
| Titling | /titling | Title transfer & documentation | Fixed service fee |
| Agents | /agents | Agent sourcing & recruitment | Zero cost — commission on close |

**Unique elements per page:**
- Rentals: toggle between short-term and long-term, availability calendar
- Buy & Sell: intent toggle (I want to buy / I want to sell), property listings gallery
- Renovations: before & after photo gallery, portfolio section
- Titling: step-by-step process explainer, document checklist
- Agents: commission structure table, earnings calculator, application form

### 4.3 Additional Pages

- About page (Katy's story, team, mission)
- Contact page (general inquiry form + map)
- Privacy Policy
- Terms of Service

---

## 5. Admin CRM Dashboard

**Access:** Katy only (Phase 1). Expandable to staff and agents in future phases.

### 5.1 Leads & Clients Module

- Lead inbox — all inquiries from all 5 service landing pages
- Auto-tagging by service type on submission
- Lead pipeline stages: New → Contacted → Qualified → Proposal Sent → Closed / Lost
- Client profile: contact details, inquiry history, notes, assigned service
- One-click proposal generation and send per service
- Follow-up reminders and task notes

### 5.2 Properties Module

- Property database with full listing details (address, type, size, rate, status, photos)
- Availability status toggle (Available / Occupied / Under Renovation / For Sale)
- Property-to-tenant linking for rentals
- Listing publish/unpublish toggle (syncs to public website)
- Interior / exterior renovation job tracker per property
- Titling status tracker per property (document checklist, milestone tracking)

### 5.3 Tenants Module

- Tenant profiles (personal info, property assigned, lease dates, payment history)
- Rental due date tracking with automated reminder scheduling
- Payment logging (amount, date, method, receipt status)
- Late payment flagging with grace period tracking
- Lease renewal alerts

### 5.4 Agents Module

- Agent roster (name, contact, coverage area, status)
- Referral tracking — which leads each agent submitted
- Commission tracker per agent per deal
- Commission payout status (Pending / Released)
- Agent onboarding email trigger on approval

### 5.5 Reports & Overview

- Dashboard summary: total leads, active properties, active tenants, pending commissions
- Revenue tracker per service line
- Lead source attribution (which landing page generated which lead)
- Monthly performance snapshot

---

## 6. Proposal Engine

**Format:** HTML email (send directly via Brevo)
**Volume:** 5 templates — one per service

| Template | File | Key Variables |
|---|---|---|
| Rentals | katy-proposal-rentals.html | Property name, rate, deposit, move-in date |
| Buy & Sell | katy-proposal-buysell.html | Property, price, commission rate, intent |
| Renovations | katy-proposal-renovations.html | Scope, size, project fee, materials estimate |
| Titling | katy-proposal-titling.html | Service type, property, govt fees, timeline |
| Agent Sourcing | katy-proposal-agents.html | Coverage area, commission rates, applicant name |

**Each proposal includes:**
- Branded header with Katy Property Solutions identity
- Client name and proposal date
- Property / service details card
- Pricing breakdown table
- Step-by-step process timeline
- What's included section
- Client testimonial
- Terms & conditions
- Dual CTA (Accept / Ask a question — both mailto links)
- Katy's signature block with photo and contact
- Branded footer with unsubscribe

**Workflow in CRM:**
1. Katy opens a lead → clicks "Send Proposal"
2. System pre-fills the correct template with client and property data
3. Katy reviews and clicks send
4. Brevo delivers the proposal and logs it on the lead's timeline

---

## 7. Rental Reminder System

**Trigger:** Automated — based on tenant due dates stored in CRM
**Delivery:** Email via Brevo + optional SMS

**Reminder schedule (configurable per tenant):**
- 7 days before due date
- 3 days before due date
- 1 day before due date
- Day of due date
- 3 days after (late payment notice)

**Each reminder includes:**
- Tenant name and property address
- Amount due and due date
- Payment instructions (GCash / bank transfer details)
- Late payment policy reminder (after grace period)
- Contact info for queries

---

## 8. Agent Distribution System

**Phase 1 (Launch):** Katy manages agent communication manually via Viber/WhatsApp + CRM tracking
**Phase 2 (Post-launch):** Agent login portal — agents see their assigned listings, referral status, and pending commissions

**Phase 1 deliverables:**
- Agent roster in CRM with coverage area and contact
- Referral submission form (agent sends client name + contact to Katy via the system)
- Commission tracker visible to Katy only
- Agent welcome proposal email (katy-proposal-agents.html)
- Agent onboarding message templates (Viber/WhatsApp)

**Phase 2 deliverables (future scope):**
- Agent login portal
- Personal dashboard: my referrals, my commissions, available listings
- Commission leaderboard (optional)

---

## 9. Marketing & Advertising Infrastructure

### 9.1 Per-Service Ad Funnel

Each service landing page is a standalone ad destination:

```
Facebook / Instagram Ad
       ↓
Service landing page (/rentals, /buy-sell, etc.)
       ↓
Lead inquiry form submitted
       ↓
CRM — lead tagged by service
       ↓
Katy follows up → proposal sent → deal closed
```

### 9.2 Social Media

- 90-day content calendar per service (to be built in Phase 2)
- Platform focus: Facebook, Instagram, TikTok
- Content types: property walkthroughs, before/after renovations, titling explainers, agent testimonials, client stories

### 9.3 Email Marketing

- Platform: Brevo
- Lists: Leads (by service), Active Tenants, Agent Network
- Campaigns: New listings announcements, seasonal promos, agent recruitment blasts

---

## 10. Client Onboarding & Collection Process

### Phase structure for collecting client requirements:

| Step | Timing | Channel | Content |
|---|---|---|---|
| Warm-up message | Night before / morning | Viber / WhatsApp | Set expectations, get a "yes" |
| Part 1 — Quick info | Morning | Viber / WhatsApp | 8 basic business questions |
| Part 2 — Services & pricing | Midday | Google Doc | Checkboxes and numbers only |
| Part 3 — Media | Afternoon | Google Drive folder | Photos and videos drop |
| End-of-day follow-up | 5pm | Viber / WhatsApp | Remove pressure, collect what's ready |
| Confirmation email | Evening | Email | Summary of received + what's pending |

### Google Drive folder structure for media collection:

```
Katy Property Solutions — Media Uploads/
├── 01 - Owner Photos/
├── 02 - Logo Files/
├── 03 - Rental Properties/
├── 04 - Buy & Sell Properties/
├── 05 - Renovation Before & After/
├── 06 - Team & Agent Photos/
├── 07 - Testimonial Videos/
└── 08 - Existing Social Media Content/
```

---

## 11. Deliverables Summary

### Phase 1 — Foundation (Priority build)

| # | Deliverable | Status |
|---|---|---|
| 1 | 5 HTML proposal email templates | ✅ Complete |
| 2 | Client discovery questionnaire (Google Doc) | ✅ Complete |
| 3 | Client onboarding message templates | ✅ Complete |
| 4 | Project scope document (this file) | ✅ Complete |
| 5 | CRM pipeline design and lead tagging logic | 🔲 Next |
| 6 | Admin CRM dashboard build | 🔲 Next |
| 7 | Website — homepage + 5 service landing pages | 🔲 Next |
| 8 | Rental reminder email templates | 🔲 Next |
| 9 | Agent onboarding email and tracking setup | 🔲 Next |

### Phase 2 — Growth (Post-launch)

| # | Deliverable | Status |
|---|---|---|
| 10 | 90-day social media content calendar | 🔲 Planned |
| 11 | Facebook / Instagram ad copy per service | 🔲 Planned |
| 12 | Brevo email marketing setup and lists | 🔲 Planned |
| 13 | Agent login portal | 🔲 Planned |
| 14 | Tenant self-service portal | 🔲 Planned |
| 15 | SEO blog / articles section | 🔲 Planned |

---

## 12. Requirements Still Pending from Client

The following must be confirmed by Katy before build can proceed. Items marked ✅ were answered in the Jun 26, 2026 questionnaire (see Section 2A); everything else is still open.

### Business identity
- [ ] Full legal business name confirmation
- [ ] Logo file (all variations)
- [ ] Brand colors (hex codes)
- [ ] Confirmed domain name

### Pricing & rates (per service)
- [ ] Rental rates (short-term and long-term)
- [ ] Security deposit and advance rent amounts
- [ ] Late payment grace period and penalty rate
- [ ] Buy & sell commission rate and payer
- [ ] Renovation fee structure and downpayment percentage
- [ ] Titling professional fee structure
- [ ] Agent commission rates per service

### Operations
- [ ] Tenant due date reminder schedule preference
- [ ] Preferred payment method for agent commissions
- [ ] Whether agents need a dedicated login portal in Phase 1 (7 agents confirmed active — timing decision still open)
- [ ] Language preference for client-facing materials
- [x] ✅ Required lead capture fields — name, phone, email, property interest, budget, move-in date, current address
- [x] ✅ Current lead sources and intake channels

### Media
- [ ] Owner professional headshot
- [ ] Logo files (all variations)
- [ ] Property photos (all listed properties)
- [ ] Before & after renovation portfolio (minimum 3 projects)
- [ ] Client testimonials (text, photo, or video)
- [ ] Owner introduction video (60–90 seconds)

### Agent roster (new — added after questionnaire)
- [ ] Names, phone numbers, and emails for the 7 existing agents
- [ ] Roles/coverage areas for agents beyond the one confirmed "Listing Agent"

---

## 13. Out of Scope (Phase 1)

The following are explicitly excluded from the current build and will be scoped separately if needed:

- Payment gateway integration (GCash / Maya / bank transfer automation)
- E-signature integration (DocuSign / SignNow)
- Accounting or bookkeeping integration
- Property valuation tools
- MLS or third-party property listing syndication
- Mobile app (iOS / Android)

---

## 14. Assumptions

- Katy is the sole admin user in Phase 1
- All properties are located in the Philippines
- Brevo will be used as the email delivery platform
- Client will supply all property photos and media
- Domain registration and hosting costs are managed by the client
- All amounts are in Philippine Peso (PHP) unless otherwise specified

---

## 15. Next Steps

1. Client completes the discovery questionnaire
2. Media assets collected via Google Drive folder
3. CRM pipeline and lead tagging logic mapped
4. Admin dashboard and website build begins
5. First review session with Katy once skeleton is live

---

---

## 16. Changelog

**v1.1 (July 2026)** — Incorporated Katy's Jun 26, 2026 questionnaire submission:
- Added Section 2A confirming business profile, service breakdowns, lead sources/intake methods, and scale (12 active listings, 28 properties managed)
- Expanded lead capture requirements to include budget, move-in date, and current address (per Katy's request)
- Confirmed 7 active agents (only one role given: Listing Agent) — roster seeded as placeholders in the database pending contact details
- Updated Section 12 to mark resolved items
- Backend: added `business_profile` table, added `budget`/`move_in_date`/`current_address`/`preferred_contact_method` columns to `leads`, added `/api/business-profile` endpoint, seeded 7 agent placeholder records

**v1.0 (July 2026)** — Initial scope document.

*Document prepared by Akie — Marketing Operations Specialist*
*Katy Property Solutions Build | July 2026*
*For questions: nadinekate.d.limjoco@gmail.com*
