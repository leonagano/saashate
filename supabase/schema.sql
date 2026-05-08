-- SaaSHate — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database.

CREATE TABLE IF NOT EXISTS saas_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'CRM',
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hate_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  saas_id UUID REFERENCES saas_products(id) ON DELETE CASCADE NOT NULL,
  reason TEXT CHECK (char_length(reason) <= 140),
  x_handle TEXT CHECK (char_length(x_handle) <= 50),
  profile_url TEXT CHECK (char_length(profile_url) <= 200),
  role TEXT,
  anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hate_votes_saas_id ON hate_votes(saas_id);
CREATE INDEX IF NOT EXISTS idx_hate_votes_created_at ON hate_votes(created_at);

-- Enable Row Level Security
ALTER TABLE saas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hate_votes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read saas_products" ON saas_products FOR SELECT USING (true);
CREATE POLICY "Public can read hate_votes" ON hate_votes FOR SELECT USING (true);

-- Public insert (anonymous voting)
CREATE POLICY "Public can insert saas_products" ON saas_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert hate_votes" ON hate_votes FOR INSERT WITH CHECK (true);

-- Seed data — top SaaS products
INSERT INTO saas_products (name, slug, category, website_url) VALUES
  ('Salesforce', 'salesforce', 'CRM', 'https://salesforce.com'),
  ('NetSuite', 'netsuite', 'Accounting', 'https://netsuite.com'),
  ('Jira', 'jira', 'Project Management', 'https://atlassian.com/jira'),
  ('SAP', 'sap', 'Accounting', 'https://sap.com'),
  ('HubSpot', 'hubspot', 'CRM', 'https://hubspot.com'),
  ('Zoom', 'zoom', 'Communication', 'https://zoom.us'),
  ('Workday', 'workday', 'HR', 'https://workday.com'),
  ('ServiceNow', 'servicenow', 'Project Management', 'https://servicenow.com'),
  ('Slack', 'slack', 'Communication', 'https://slack.com'),
  ('Notion', 'notion', 'Project Management', 'https://notion.so'),
  ('Dropbox', 'dropbox', 'DevTools', 'https://dropbox.com'),
  ('Marketo', 'marketo', 'Marketing', 'https://marketo.com'),
  ('Asana', 'asana', 'Project Management', 'https://asana.com'),
  ('BambooHR', 'bamboohr', 'HR', 'https://bamboohr.com'),
  ('Monday.com', 'monday-com', 'Project Management', 'https://monday.com'),
  ('Zendesk', 'zendesk', 'CRM', 'https://zendesk.com'),
  ('Intercom', 'intercom', 'Marketing', 'https://intercom.com'),
  ('QuickBooks', 'quickbooks', 'Accounting', 'https://quickbooks.com'),
  ('Mixpanel', 'mixpanel', 'Analytics', 'https://mixpanel.com'),
  ('Datadog', 'datadog', 'DevTools', 'https://datadog.com')
ON CONFLICT (slug) DO NOTHING;
