-- ============================================================
-- Katy Property Solutions — Rich SQLite Seed Data
-- ============================================================

-- ---------- 1. BUSINESS PROFILE ----------
INSERT OR REPLACE INTO business_profile (
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
  '["Tenant placement","Lease management","Rent collection","Property maintenance coordination","Eviction support"]',
  '["Buyer representation","Seller representation","Comparative market analysis","Offer negotiation","Open house support"]',
  '["Project management","Budget planning","Vendor coordination","Site visits","Permit coordination","Design consultation"]',
  '["Title search","Deed preparation","Document filing","Notarization coordination","Compliance review"]',
  '["Agent recruitment","Agent screening","Commission split setup","Referral matching"]',
  '["Website","Phone calls","Email inquiries","Social media","Referrals","Walking in","Property portals","Open houses"]',
  '["Web form","Phone call","Email","Text message","Walk-in","Referral","Social media"]',
  '["Name","Phone","Email","Property interest","Budget","Move-in date","Current address"]',
  'Any',
  12,
  28,
  1,
  7
);

-- ---------- 2. CLIENTS ----------
DELETE FROM clients;
INSERT INTO clients (id, full_name, email, phone, notes) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Nico Lim', 'nicolim.dev@gmail.com', '09171234567', 'Interested in BGC condo for long term lease.'),
  ('c2222222-2222-2222-2222-222222222222', 'Sophia Reyes', 'sophia.reyes@yahoo.com', '09187654321', 'Looking to buy a luxury property in Ortigas or Makati.'),
  ('c3333333-3333-3333-3333-333333333333', 'Daniel Tan', 'dtan88@gmail.com', '09228889999', 'Wants a modern kitchen and living room renovation for his QC home.'),
  ('c4444444-4444-4444-4444-444444444444', 'Therese Cruz', 'therese.cruz@outlook.com', '09051112222', 'Needs assistance with a title transfer/search for a inherited property.'),
  ('c5555555-5555-5555-5555-555555555555', 'Arianne Go', 'arianne.go@gmail.com', '09192223333', 'Current tenant in BGC Condo.'),
  ('c6666666-6666-6666-6666-666666666666', 'Kenji Sato', 'sato.kenji@gmail.com', '09174445555', 'Current tenant in Makati Studio.');

-- ---------- 3. AGENTS ----------
DELETE FROM agents;
INSERT INTO agents (id, full_name, email, phone, coverage_area, status, onboarded_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Juan Dela Cruz', 'juan.delacruz@katyproperty.com', '09159990001', 'BGC & Taguig', 'active', '2025-01-10T08:00:00Z'),
  ('a2222222-2222-2222-2222-222222222222', 'Maria Santos', 'maria.santos@katyproperty.com', '09159990002', 'Makati CBD', 'active', '2025-02-15T09:30:00Z'),
  ('a3333333-3333-3333-3333-333333333333', 'Mark Reyes', 'mark.reyes@katyproperty.com', '09159990003', 'Ortigas & Pasig', 'active', '2025-03-20T10:15:00Z'),
  ('a4444444-4444-4444-4444-444444444444', 'Patricia Lim', 'pat.lim@gmail.com', '09159990004', 'Quezon City', 'active', '2026-05-12T14:00:00Z'),
  ('a5555555-5555-5555-5555-555555555555', 'Joseph Alcaraz', 'joe.alcaraz@yahoo.com', '09159990005', 'Mandaluyong & San Juan', 'active', '2026-06-01T11:00:00Z'),
  ('a6666666-6666-6666-6666-666666666666', 'Nadine Kate - Listing Agent', 'nadine.kate@katyproperty.com', '09159990006', 'All Areas (Lead Broker)', 'active', '2024-07-01T08:00:00Z'),
  ('a7777777-7777-7777-7777-777777777777', 'Alvin Mendoza', 'alvin.mendoza@gmail.com', '09159990007', 'Alabang & Paranaque', 'applied', NULL);

-- ---------- 4. PROPERTIES ----------
DELETE FROM properties;
INSERT INTO properties (id, title, address, property_type, size_sqm, status, rental_term, rate, is_published, description) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Stunning 2BR Loft in BGC', 'Icon Plaza, 25th St, BGC, Taguig', 'condo', 85, 'occupied', 'long_term', 75000, 1, 'Beautiful loft-type 2-bedroom apartment with skyline views, fully furnished, modern kitchen, and parking space.'),
  ('p2222222-2222-2222-2222-222222222222', 'Minimalist Studio Condo', 'The Rise Makati, Malugay St, Makati', 'condo', 30, 'occupied', 'short_term', 3500, 1, 'Cozy and modern studio unit situated in the heart of Makati. Perfect for staycations, business travelers, or students.'),
  ('p3333333-3333-3333-3333-333333333333', 'Sleek Penthouse in Ortigas', 'One Shangri-La Place, Ortigas Center, Pasig', 'condo', 150, 'available', NULL, 28000000, 1, 'Luxurious penthouse unit with 3 bedrooms, floor-to-ceiling windows, private balcony, and direct access to Shangri-La Plaza.'),
  ('p4444444-4444-4444-4444-444444444444', 'Modern Family Home', 'Loyola Grand Villas, Quezon City', 'house', 350, 'sold', NULL, 35000000, 0, 'Spacious 4-bedroom house with a swimming pool, pocket garden, 3-car garage, and 24/7 security in a premium gated community.'),
  ('p5555555-5555-5555-5555-555555555555', 'Renovated Townhouse', 'Shaw Blvd, Mandaluyong City', 'house', 120, 'under_renovation', NULL, 12000000, 1, 'Modern 3-story townhouse currently undergoing full interior upgrades. Great investment near commercial centers.'),
  ('p6666666-6666-6666-6666-666666666666', 'Prime Commercial Space', 'Katipunan Ave, Quezon City', 'commercial', 200, 'available', 'long_term', 120000, 1, 'Ground floor retail space with high foot traffic, wide frontage, and parking slots. Ideal for cafe, clinic, or showroom.');

-- ---------- 5. PROPERTY PHOTOS ----------
DELETE FROM property_photos;
INSERT INTO property_photos (id, property_id, url, is_before_after, before_after, sort_order) VALUES
  ('ph111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', 0, NULL, 1),
  ('ph111112-1111-1111-1111-111111111112', 'p1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 0, NULL, 2),
  ('ph222221-2222-2222-2222-222222222221', 'p2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', 0, NULL, 1),
  ('ph333331-3333-3333-3333-333333333331', 'p3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', 0, NULL, 1),
  ('ph555551-5555-5555-5555-555555555551', 'p5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 1, 'before', 1),
  ('ph555552-5555-5555-5555-555555555552', 'p5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 1, 'after', 2);

-- ---------- 6. LEADS ----------
DELETE FROM leads;
INSERT INTO leads (id, client_id, service, stage, source_page, property_id, agent_id, assigned_notes, proposal_sent_at, proposal_template, budget, move_in_date, current_address, preferred_contact_method) VALUES
  ('l1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'rentals', 'qualified', '/rentals', 'p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Assigned to Juan Dela Cruz. Client ready to view on Saturday.', NULL, NULL, 70000, '2026-08-01', 'Greenhills, San Juan', 'Viber'),
  ('l2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'buy_sell', 'proposal_sent', '/buy-sell', 'p3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Sent proposal for Shangri-La penthouse. Waiting for response.', '2026-07-05T15:30:00Z', 'buy_sell', 28000000, NULL, 'Quezon City', 'Email'),
  ('l3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'renovations', 'contacted', '/renovations', 'p5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 'Initial visit scheduled next Monday to discuss design consultation.', NULL, NULL, 2000000, NULL, 'New Manila, Quezon City', 'Phone'),
  ('l4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'titling', 'new', '/titling', NULL, NULL, 'New titling request. Needs full title search and compliance review.', NULL, NULL, 15000, NULL, 'Pasig City', 'Any');

-- ---------- 7. LEAD ACTIVITY ----------
DELETE FROM lead_activity;
INSERT INTO lead_activity (id, lead_id, activity_type, content, created_at) VALUES
  ('la111111-1111-1111-1111-111111111111', 'l1111111-1111-1111-1111-111111111111', 'note', 'Lead created from rentals inquiry form.', '2026-07-01T10:00:00Z'),
  ('la111112-1111-1111-1111-111111111112', 'l1111111-1111-1111-1111-111111111111', 'stage_change', 'Stage changed to qualified', '2026-07-02T11:30:00Z'),
  ('la222221-2222-2222-2222-222222222221', 'l2222222-2222-2222-2222-222222222222', 'note', 'Client requested offer details and negotiation rates.', '2026-07-04T09:00:00Z'),
  ('la222222-2222-2222-2222-222222222222', 'l2222222-2222-2222-2222-222222222222', 'proposal_sent', 'Proposal sent to sophia.reyes@yahoo.com', '2026-07-05T15:30:00Z');

-- ---------- 8. TENANTS ----------
DELETE FROM tenants;
INSERT INTO tenants (id, client_id, property_id, full_name, phone, email, lease_start, lease_end, monthly_rate, due_day_of_month, grace_period_days, reminder_schedule) VALUES
  ('t1111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 'p1111111-1111-1111-1111-111111111111', 'Arianne Go', '09192223333', 'arianne.go@gmail.com', '2026-01-01', '2026-12-31', 75000, 5, 3, '["due_7d","due_3d","due_1d","due_today","late_3d"]'),
  ('t2222222-2222-2222-2222-222222222222', 'c6666666-6666-6666-6666-666666666666', 'p2222222-2222-2222-2222-222222222222', 'Kenji Sato', '09174445555', 'sato.kenji@gmail.com', '2026-06-15', '2026-09-15', 60000, 15, 0, '["due_7d","due_3d","due_1d","due_today","late_3d"]');

-- ---------- 9. PAYMENTS ----------
DELETE FROM payments;
-- Arianne Go's payments (due on the 5th)
-- January to June: Paid. July: Pending (Assuming current date is July 6, 2026, so July 5 payment is pending/due)
INSERT INTO payments (id, tenant_id, amount, due_date, paid_date, method, status, receipt_url) VALUES
  ('pay111-01', 't1111111-1111-1111-1111-111111111111', 75000, '2026-01-05', '2026-01-04', 'bank_transfer', 'paid', 'http://receipts.org/pay111-01.png'),
  ('pay111-02', 't1111111-1111-1111-1111-111111111111', 75000, '2026-02-05', '2026-02-05', 'gcash', 'paid', 'http://receipts.org/pay111-02.png'),
  ('pay111-03', 't1111111-1111-1111-1111-111111111111', 75000, '2026-03-05', '2026-03-03', 'bank_transfer', 'paid', 'http://receipts.org/pay111-03.png'),
  ('pay111-04', 't1111111-1111-1111-1111-111111111111', 75000, '2026-04-05', '2026-04-05', 'gcash', 'paid', 'http://receipts.org/pay111-04.png'),
  ('pay111-05', 't1111111-1111-1111-1111-111111111111', 75000, '2026-05-05', '2026-05-04', 'bank_transfer', 'paid', 'http://receipts.org/pay111-05.png'),
  ('pay111-06', 't1111111-1111-1111-1111-111111111111', 75000, '2026-06-05', '2026-06-05', 'gcash', 'paid', 'http://receipts.org/pay111-06.png'),
  ('pay111-07', 't1111111-1111-1111-1111-111111111111', 75000, '2026-07-05', NULL, NULL, 'pending', NULL);

-- Kenji Sato's payments (due on the 15th)
-- June: Paid. July: Pending (due in 9 days relative to July 6)
INSERT INTO payments (id, tenant_id, amount, due_date, paid_date, method, status, receipt_url) VALUES
  ('pay222-06', 't2222222-2222-2222-2222-222222222222', 60000, '2026-06-15', '2026-06-15', 'gcash', 'paid', 'http://receipts.org/pay222-06.png'),
  ('pay222-07', 't2222222-2222-2222-2222-222222222222', 60000, '2026-07-15', NULL, NULL, 'pending', NULL);

-- ---------- 10. COMMISSIONS ----------
DELETE FROM commissions;
INSERT INTO commissions (id, agent_id, lead_id, service, amount, status, released_at) VALUES
  ('com111-01', 'a1111111-1111-1111-1111-111111111111', 'l1111111-1111-1111-1111-111111111111', 'rentals', 25000, 'pending', NULL),
  ('com111-02', 'a3333333-3333-3333-3333-333333333333', 'l2222222-2222-2222-2222-222222222222', 'buy_sell', 560000, 'released', '2026-06-25T11:00:00Z');

-- ---------- 11. RENOVATION JOBS ----------
DELETE FROM renovation_jobs;
INSERT INTO renovation_jobs (id, property_id, lead_id, scope, project_fee, materials_estimate, status, started_at, completed_at) VALUES
  ('job111-ren', 'p5555555-5555-5555-5555-555555555555', 'l3333333-3333-3333-3333-333333333333', 'Complete townhouse painting, flooring, and kitchen upgrade.', 1500000, 1000000, 'in_progress', '2026-06-10', NULL);

-- ---------- 12. TITLING JOBS ----------
DELETE FROM titling_jobs;
INSERT INTO titling_jobs (id, property_id, lead_id, service_type, govt_fees, timeline_days, checklist, milestone) VALUES
  ('job222-tit', 'p3333333-3333-3333-3333-333333333333', 'l4444444-4444-4444-4444-444444444444', 'Deed of Sale & Title Transfer Registration', 45000, 60, '[{"item":"Deed of Sale Notarized","done":true},{"item":"BIR Tax Clearance Release","done":false},{"item":"Transfer Tax Payment","done":false},{"item":"Registry of Deeds Title Registration","done":false}]', 'tax_clearance_pending');
