-- ============================================================
-- Katy Property Solutions — CRM Database Schema
-- Target: Supabase (PostgreSQL)
-- ============================================================

-- ---------- ENUM TYPES ----------

CREATE TYPE service_type AS ENUM (
  'rentals', 'buy_sell', 'renovations', 'titling', 'agents'
);

CREATE TYPE lead_stage AS ENUM (
  'new', 'contacted', 'qualified', 'proposal_sent', 'closed', 'lost'
);

CREATE TYPE property_status AS ENUM (
  'available', 'occupied', 'under_renovation', 'for_sale', 'sold'
);

CREATE TYPE rental_term AS ENUM (
  'short_term', 'long_term', 'flexible'
);

CREATE TYPE payment_method AS ENUM (
  'gcash', 'bank_transfer', 'cash', 'other'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'late', 'partial'
);

CREATE TYPE commission_status AS ENUM (
  'pending', 'released'
);

CREATE TYPE agent_status AS ENUM (
  'applied', 'active', 'inactive'
);

CREATE TYPE reminder_type AS ENUM (
  'due_7d', 'due_3d', 'due_1d', 'due_today', 'late_3d'
);


-- ---------- CORE: CLIENTS ----------

CREATE TABLE clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes           TEXT
);


-- ---------- AGENTS (created early — referenced by leads) ----------

CREATE TABLE agents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  coverage_area   TEXT,
  status          agent_status NOT NULL DEFAULT 'applied',
  onboarded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- PROPERTIES (created early — referenced by leads) ----------

CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  address         TEXT NOT NULL,
  property_type   TEXT,                 -- house, condo, lot, commercial, etc.
  size_sqm        NUMERIC,
  status          property_status NOT NULL DEFAULT 'available',
  rental_term     rental_term,          -- null unless it's a rental listing
  rate            NUMERIC,              -- monthly rate or sale price depending on context
  is_published    BOOLEAN NOT NULL DEFAULT false,  -- syncs to public site
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE property_photos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  is_before_after BOOLEAN NOT NULL DEFAULT false,   -- for renovation gallery
  before_after    TEXT,                 -- 'before' | 'after' | null
  sort_order      INT DEFAULT 0
);

CREATE TABLE renovation_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lead_id         UUID,  -- FK to leads added below, after leads table is created
  scope           TEXT,
  project_fee     NUMERIC,
  materials_estimate NUMERIC,
  status          TEXT DEFAULT 'in_progress',  -- in_progress, complete, on_hold
  started_at      DATE,
  completed_at    DATE
);

CREATE TABLE titling_jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lead_id         UUID,  -- FK to leads added below, after leads table is created
  service_type    TEXT,                 -- transfer, extrajudicial settlement, etc.
  govt_fees       NUMERIC,
  timeline_days   INT,
  checklist       JSONB DEFAULT '[]',   -- [{ "item": "Deed of Sale", "done": false }, ...]
  milestone       TEXT DEFAULT 'not_started'
);


-- ---------- LEADS (depends on clients, properties, agents) ----------

CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
  service         service_type NOT NULL,
  stage           lead_stage NOT NULL DEFAULT 'new',
  source_page     TEXT,                 -- e.g. '/rentals' — for attribution
  property_id     UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id        UUID REFERENCES agents(id) ON DELETE SET NULL,  -- referral source, if any
  assigned_notes  TEXT,
  proposal_sent_at TIMESTAMPTZ,
  proposal_template TEXT,
  -- Fields Katy specifically requires captured on every lead (per intake questionnaire):
  budget          NUMERIC,              -- client's stated budget/rate range
  move_in_date    DATE,                 -- rentals: desired move-in date
  current_address TEXT,                 -- lead's current address, at Katy's request
  preferred_contact_method TEXT,        -- Katy accepts any method, but logs the lead's stated preference
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lead_activity (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type   TEXT NOT NULL,        -- 'note', 'stage_change', 'proposal_sent', 'follow_up'
  content         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Now that leads exists, wire up the deferred FKs from renovation_jobs/titling_jobs
ALTER TABLE renovation_jobs
  ADD CONSTRAINT fk_renovation_jobs_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;

ALTER TABLE titling_jobs
  ADD CONSTRAINT fk_titling_jobs_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL;


-- ---------- TENANTS & PAYMENTS ----------

CREATE TABLE tenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  lease_start     DATE,
  lease_end       DATE,
  monthly_rate    NUMERIC,
  due_day_of_month INT,                 -- e.g. 5 = due on the 5th each month
  grace_period_days INT DEFAULT 0,
  reminder_schedule reminder_type[] DEFAULT ARRAY['due_7d','due_3d','due_1d','due_today','late_3d']::reminder_type[],
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount          NUMERIC NOT NULL,
  due_date        DATE NOT NULL,
  paid_date       DATE,
  method          payment_method,
  status          payment_status NOT NULL DEFAULT 'pending',
  receipt_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reminder_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  payment_id      UUID REFERENCES payments(id) ON DELETE SET NULL,
  reminder_type   reminder_type NOT NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  channel         TEXT NOT NULL DEFAULT 'email'  -- 'email' | 'sms'
);


-- ---------- COMMISSIONS ----------

CREATE TABLE commissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  lead_id         UUID REFERENCES leads(id) ON DELETE SET NULL,
  service         service_type,
  amount          NUMERIC,
  status          commission_status NOT NULL DEFAULT 'pending',
  released_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- BUSINESS PROFILE (singleton — Katy's company-level intake data) ----------

CREATE TABLE business_profile (
  id                        INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- enforce single row
  primary_contact_name      TEXT,
  contact_email             TEXT,
  business_type             TEXT,
  years_in_business         INT,
  rental_services           TEXT[],
  buy_sell_services         TEXT[],
  renovation_services       TEXT[],
  titling_services          TEXT[],
  agent_sourcing_services   TEXT[],
  lead_sources              TEXT[],
  lead_intake_methods       TEXT[],
  required_lead_fields      TEXT[],
  preferred_contact_method  TEXT,
  active_listings_approx    INT,
  properties_managed_approx INT,
  works_with_agents         BOOLEAN,
  agent_count_reported      INT,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- REPORTING VIEWS ----------

CREATE VIEW v_dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM leads) AS total_leads,
  (SELECT COUNT(*) FROM properties WHERE status = 'available') AS active_properties,
  (SELECT COUNT(*) FROM tenants WHERE lease_end IS NULL OR lease_end >= CURRENT_DATE) AS active_tenants,
  (SELECT COUNT(*) FROM commissions WHERE status = 'pending') AS pending_commissions;

CREATE VIEW v_lead_source_attribution AS
SELECT source_page, service, COUNT(*) AS lead_count
FROM leads
GROUP BY source_page, service
ORDER BY lead_count DESC;

CREATE VIEW v_revenue_by_service AS
SELECT service, COUNT(*) FILTER (WHERE stage = 'closed') AS closed_deals
FROM leads
GROUP BY service;


-- ---------- INDEXES ----------

CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_service ON leads(service);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_tenants_property ON tenants(property_id);
CREATE INDEX idx_commissions_agent ON commissions(agent_id);
