-- ============================================================
-- Katy Property Solutions — CRM SQLite Schema
-- Target: SQLite (Fallback local environment)
-- ============================================================

-- ---------- CORE: CLIENTS ----------

CREATE TABLE IF NOT EXISTS clients (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  created_at      TEXT NOT NULL DEFAULT (now()),
  notes           TEXT
);


-- ---------- AGENTS ----------

CREATE TABLE IF NOT EXISTS agents (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  full_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  coverage_area   TEXT,
  status          TEXT NOT NULL DEFAULT 'applied',
  onboarded_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (now())
);


-- ---------- PROPERTIES ----------

CREATE TABLE IF NOT EXISTS properties (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  title           TEXT NOT NULL,
  address         TEXT NOT NULL,
  property_type   TEXT,                 -- house, condo, lot, commercial, etc.
  size_sqm        REAL,
  status          TEXT NOT NULL DEFAULT 'available',
  rental_term     TEXT,                 -- null unless it's a rental listing
  rate            REAL,                 -- monthly rate or sale price depending on context
  is_published    INTEGER NOT NULL DEFAULT 0,  -- syncs to public site
  description     TEXT,
  amenities       TEXT DEFAULT '[]',    -- JSON array text, auto-parsed back to an array on read (autoParseJSON)
  max_occupancy   INTEGER,
  created_at      TEXT NOT NULL DEFAULT (now()),
  updated_at      TEXT NOT NULL DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS property_photos (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  property_id     TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  is_before_after INTEGER NOT NULL DEFAULT 0,   -- for renovation gallery
  before_after    TEXT,                 -- 'before' | 'after' | null
  sort_order      INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS renovation_jobs (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  property_id     TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lead_id         TEXT,  -- FK to leads
  scope           TEXT,
  project_fee     REAL,
  materials_estimate REAL,
  status          TEXT DEFAULT 'in_progress',  -- in_progress, complete, on_hold
  started_at      TEXT,
  completed_at    TEXT,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS titling_jobs (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  property_id     TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lead_id         TEXT,  -- FK to leads
  service_type    TEXT,                 -- transfer, extrajudicial settlement, etc.
  govt_fees       REAL,
  timeline_days   INTEGER,
  checklist       TEXT DEFAULT '[]',    -- JSON string: [{ "item": "Deed of Sale", "done": false }, ...]
  milestone       TEXT DEFAULT 'not_started',
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);


-- ---------- LEADS ----------

CREATE TABLE IF NOT EXISTS leads (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  client_id       TEXT REFERENCES clients(id) ON DELETE SET NULL,
  service         TEXT NOT NULL,
  stage           TEXT NOT NULL DEFAULT 'new',
  source_page     TEXT,                 -- e.g. '/rentals' — for attribution
  property_id     TEXT REFERENCES properties(id) ON DELETE SET NULL,
  agent_id        TEXT REFERENCES agents(id) ON DELETE SET NULL,  -- referral source, if any
  assigned_notes  TEXT,
  proposal_sent_at TEXT,
  proposal_template TEXT,
  budget          REAL,                 -- client's stated budget/rate range
  move_in_date    TEXT,                 -- rentals: desired move-in date
  current_address TEXT,                 -- lead's current address, at Katy's request
  preferred_contact_method TEXT,        -- Katy accepts any method, but logs the lead's stated preference
  created_at      TEXT NOT NULL DEFAULT (now()),
  updated_at      TEXT NOT NULL DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS lead_activity (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  lead_id         TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type   TEXT NOT NULL,        -- 'note', 'stage_change', 'proposal_sent', 'follow_up'
  content         TEXT,
  created_at      TEXT NOT NULL DEFAULT (now())
);


-- ---------- TENANTS & PAYMENTS ----------

CREATE TABLE IF NOT EXISTS tenants (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  client_id       TEXT REFERENCES clients(id) ON DELETE SET NULL,
  property_id     TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  lease_start     TEXT,
  lease_end       TEXT,
  monthly_rate    REAL,
  due_day_of_month INTEGER,                 -- e.g. 5 = due on the 5th each month
  grace_period_days INTEGER DEFAULT 0,
  reminder_schedule TEXT DEFAULT '["due_7d","due_3d","due_1d","due_today","late_3d"]',
  created_at      TEXT NOT NULL DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS payments (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  tenant_id       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount          REAL NOT NULL,
  due_date        TEXT NOT NULL,
  paid_date       TEXT,
  method          TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  receipt_url     TEXT,
  created_at      TEXT NOT NULL DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS reminder_log (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  tenant_id       TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  payment_id      TEXT REFERENCES payments(id) ON DELETE SET NULL,
  reminder_type   TEXT NOT NULL,
  sent_at         TEXT NOT NULL DEFAULT (now()),
  channel         TEXT NOT NULL DEFAULT 'email'  -- 'email' | 'sms'
);


-- ---------- COMMISSIONS ----------

CREATE TABLE IF NOT EXISTS commissions (
  id              TEXT PRIMARY KEY DEFAULT (gen_random_uuid()),
  agent_id        TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  lead_id         TEXT REFERENCES leads(id) ON DELETE SET NULL,
  service         TEXT,
  amount          REAL,
  status          TEXT NOT NULL DEFAULT 'pending',
  released_at     TEXT,
  created_at      TEXT NOT NULL DEFAULT (now())
);


-- ---------- BUSINESS PROFILE ----------

CREATE TABLE IF NOT EXISTS business_profile (
  id                        INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- enforce single row
  primary_contact_name      TEXT,
  contact_email             TEXT,
  business_type             TEXT,
  years_in_business         INTEGER,
  rental_services           TEXT, -- JSON string
  buy_sell_services         TEXT, -- JSON string
  renovation_services       TEXT, -- JSON string
  titling_services          TEXT, -- JSON string
  agent_sourcing_services   TEXT, -- JSON string
  lead_sources              TEXT, -- JSON string
  lead_intake_methods       TEXT, -- JSON string
  required_lead_fields      TEXT, -- JSON string
  preferred_contact_method  TEXT,
  active_listings_approx    INTEGER,
  properties_managed_approx INTEGER,
  works_with_agents         INTEGER, -- Boolean 0/1
  agent_count_reported      INTEGER,
  updated_at                TEXT NOT NULL DEFAULT (now())
);


-- ---------- REPORTING VIEWS ----------

DROP VIEW IF EXISTS v_dashboard_summary;
CREATE VIEW v_dashboard_summary AS
SELECT
  (SELECT COUNT(*) FROM leads) AS total_leads,
  (SELECT COUNT(*) FROM properties WHERE status = 'available') AS active_properties,
  (SELECT COUNT(*) FROM tenants WHERE lease_end IS NULL OR lease_end >= CURRENT_DATE) AS active_tenants,
  (SELECT COUNT(*) FROM commissions WHERE status = 'pending') AS pending_commissions;

DROP VIEW IF EXISTS v_lead_source_attribution;
CREATE VIEW v_lead_source_attribution AS
SELECT source_page, service, COUNT(*) AS lead_count
FROM leads
GROUP BY source_page, service
ORDER BY lead_count DESC;

DROP VIEW IF EXISTS v_revenue_by_service;
CREATE VIEW v_revenue_by_service AS
SELECT service, COUNT(*) FILTER (WHERE stage = 'closed') AS closed_deals
FROM leads
GROUP BY service;


-- ---------- INDEXES ----------

CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_service ON leads(service);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_tenants_property ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_commissions_agent ON commissions(agent_id);
