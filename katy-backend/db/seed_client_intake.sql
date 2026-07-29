-- ============================================================
-- Katy Property Solutions — Client Intake Seed Data
-- Source: client discovery questionnaire, submitted Jun 26, 2026
-- Run once, after schema.sql
-- ============================================================

-- ---------- BUSINESS PROFILE ----------
-- Note: pricing, branding, and media fields were left blank by Katy
-- (she was told to skip anything she wasn't sure of yet).
-- See Section 12 of the project scope doc for what's still pending.

INSERT INTO business_profile (
  id,
  primary_contact_name,
  contact_email,
  business_type,
  years_in_business,
  rental_services,
  buy_sell_services,
  renovation_services,
  titling_services,
  agent_sourcing_services,
  lead_sources,
  lead_intake_methods,
  required_lead_fields,
  preferred_contact_method,
  active_listings_approx,
  properties_managed_approx,
  works_with_agents,
  agent_count_reported
) VALUES (
  1,
  'Katherine Limjoco Quiñones',
  'bquin1921@gmail.com',
  'Property Management',
  4,
  ARRAY['Tenant placement','Lease management','Rent collection','Property maintenance coordination','Eviction support'],
  ARRAY['Buyer representation','Seller representation','Comparative market analysis','Offer negotiation','Open house support'],
  ARRAY['Project management','Budget planning','Vendor coordination','Site visits','Permit coordination','Design consultation'],
  ARRAY['Title search','Deed preparation','Document filing','Notarization coordination','Compliance review'],
  ARRAY['Agent recruitment','Agent screening','Commission split setup','Referral matching'],
  ARRAY['Website','Phone calls','Email inquiries','Social media','Referrals','Walking in','Property portals','Open houses'],
  ARRAY['Web form','Phone call','Email','Text message','Walk-in','Referral','Social media'],
  ARRAY['Name','Phone','Email','Property interest','Budget','Move-in date','Current address'],
  'Any',
  12,
  28,
  true,
  7
)
ON CONFLICT (id) DO UPDATE SET
  primary_contact_name = EXCLUDED.primary_contact_name,
  contact_email = EXCLUDED.contact_email,
  business_type = EXCLUDED.business_type,
  years_in_business = EXCLUDED.years_in_business,
  rental_services = EXCLUDED.rental_services,
  buy_sell_services = EXCLUDED.buy_sell_services,
  renovation_services = EXCLUDED.renovation_services,
  titling_services = EXCLUDED.titling_services,
  agent_sourcing_services = EXCLUDED.agent_sourcing_services,
  lead_sources = EXCLUDED.lead_sources,
  lead_intake_methods = EXCLUDED.lead_intake_methods,
  required_lead_fields = EXCLUDED.required_lead_fields,
  preferred_contact_method = EXCLUDED.preferred_contact_method,
  active_listings_approx = EXCLUDED.active_listings_approx,
  properties_managed_approx = EXCLUDED.properties_managed_approx,
  works_with_agents = EXCLUDED.works_with_agents,
  agent_count_reported = EXCLUDED.agent_count_reported,
  updated_at = now();


-- ---------- AGENTS ----------
-- Katy reported 7 agents already on her team, but only gave a role
-- ("Listing Agent") for one — name/phone/email were left blank.
-- Seeding 7 placeholder slots so the roster reflects her real headcount;
-- these need real names/contacts before the CRM is usable for referral tracking.

INSERT INTO agents (full_name, email, phone, coverage_area, status)
VALUES
  ('Agent 1 (name pending)', NULL, NULL, NULL, 'active'),
  ('Agent 2 (name pending)', NULL, NULL, NULL, 'active'),
  ('Agent 3 (name pending)', NULL, NULL, NULL, 'active'),
  ('Agent 4 (name pending)', NULL, NULL, NULL, 'active'),
  ('Agent 5 (name pending)', NULL, NULL, NULL, 'active'),
  ('Agent 6 - Listing Agent (name pending)', NULL, NULL, NULL, 'active'),
  ('Agent 7 (name pending)', NULL, NULL, NULL, 'active');
