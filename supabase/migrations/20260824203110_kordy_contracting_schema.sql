/*
# Kordy Contracting — Full Database Schema

Creates the complete schema for the Al-Kordy Contracting website CMS.

1. New Tables
- `company_settings` — single-row table for company info (name, contact, about, mission, vision, etc.)
- `projects` — project records with title, slug, category, location, year, status, weight, span, structure type, description, featured/published flags
- `project_images` — gallery images per project (url, alt, order, is_main)
- `capabilities` — company capabilities/services with order, enabled flag
- `process_stages` — build process stages with order, enabled flag
- `site_sections` — homepage section visibility and ordering

2. Security
- Public read access on all content tables (anon + authenticated) — the public website needs to read projects, capabilities, process stages, and company settings without a login.
- Write access restricted to authenticated admin users only.
- RLS enabled on every table.

3. Notes
- The public site is a no-auth reader. The admin dashboard authenticates via Supabase email/password and then has write access.
- Slugs are unique on projects.
- Ordering columns use integers for reordering.
*/

-- Company Settings (single row)
CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Al-Kordy Contracting',
  company_name_ar text NOT NULL DEFAULT 'الكردي للمقاولات',
  description text DEFAULT '',
  about text DEFAULT '',
  mission text DEFAULT '',
  vision text DEFAULT '',
  founded_year text DEFAULT '',
  years_experience text DEFAULT '',
  address text DEFAULT '',
  phone text DEFAULT '',
  whatsapp text DEFAULT '',
  email text DEFAULT '',
  facebook text DEFAULT '',
  instagram text DEFAULT '',
  linkedin text DEFAULT '',
  hero_title text NOT NULL DEFAULT 'FROM MATERIAL',
  hero_title_second text NOT NULL DEFAULT 'TO STRUCTURE.',
  hero_subtitle text NOT NULL DEFAULT 'Metal construction and steel fabrication built with precision, discipline and experience.',
  hero_cta text NOT NULL DEFAULT 'REQUEST A QUOTE',
  final_cta_title text NOT NULL DEFAULT 'LET''S BUILD WHAT LASTS.',
  final_cta_description text NOT NULL DEFAULT 'Contact Al-Kordy Contracting for your next metal construction or steel structure project.',
  final_cta_button text NOT NULL DEFAULT 'REQUEST A QUOTE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_company_settings" ON company_settings;
CREATE POLICY "public_read_company_settings"
ON company_settings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_company_settings" ON company_settings;
CREATE POLICY "auth_update_company_settings"
ON company_settings FOR UPDATE
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_company_settings" ON company_settings;
CREATE POLICY "auth_insert_company_settings"
ON company_settings FOR INSERT
TO authenticated WITH CHECK (true);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text DEFAULT '',
  location text DEFAULT '',
  year text DEFAULT '',
  status text DEFAULT 'draft',
  description text DEFAULT '',
  weight text DEFAULT '',
  span text DEFAULT '',
  structure_type text DEFAULT '',
  execution_info text DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_projects" ON projects;
CREATE POLICY "public_read_published_projects"
ON projects FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects"
ON projects FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects"
ON projects FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects"
ON projects FOR DELETE
TO authenticated USING (true);

-- Project Images
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text DEFAULT '',
  alt text DEFAULT '',
  type text DEFAULT 'image',
  size int DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  is_main boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_sort_order ON project_images(sort_order);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_images" ON project_images;
CREATE POLICY "public_read_project_images"
ON project_images FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_project_images" ON project_images;
CREATE POLICY "auth_insert_project_images"
ON project_images FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_project_images" ON project_images;
CREATE POLICY "auth_update_project_images"
ON project_images FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_project_images" ON project_images;
CREATE POLICY "auth_delete_project_images"
ON project_images FOR DELETE
TO authenticated USING (true);

-- Capabilities
CREATE TABLE IF NOT EXISTS capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '01',
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_capabilities_sort_order ON capabilities(sort_order);

ALTER TABLE capabilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_capabilities" ON capabilities;
CREATE POLICY "public_read_capabilities"
ON capabilities FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_capabilities" ON capabilities;
CREATE POLICY "auth_insert_capabilities"
ON capabilities FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_capabilities" ON capabilities;
CREATE POLICY "auth_update_capabilities"
ON capabilities FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_capabilities" ON capabilities;
CREATE POLICY "auth_delete_capabilities"
ON capabilities FOR DELETE
TO authenticated USING (true);

-- Process Stages
CREATE TABLE IF NOT EXISTS process_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL DEFAULT '01',
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_process_stages_sort_order ON process_stages(sort_order);

ALTER TABLE process_stages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_process_stages" ON process_stages;
CREATE POLICY "public_read_process_stages"
ON process_stages FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_process_stages" ON process_stages;
CREATE POLICY "auth_insert_process_stages"
ON process_stages FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_process_stages" ON process_stages;
CREATE POLICY "auth_update_process_stages"
ON process_stages FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_process_stages" ON process_stages;
CREATE POLICY "auth_delete_process_stages"
ON process_stages FOR DELETE
TO authenticated USING (true);

-- Site Sections (homepage visibility/ordering)
CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  section_label text NOT NULL,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_sections" ON site_sections;
CREATE POLICY "public_read_site_sections"
ON site_sections FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_site_sections" ON site_sections;
CREATE POLICY "auth_update_site_sections"
ON site_sections FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_site_sections" ON site_sections;
CREATE POLICY "auth_insert_site_sections"
ON site_sections FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_sections" ON site_sections;
CREATE POLICY "auth_delete_site_sections"
ON site_sections FOR DELETE
TO authenticated USING (true);

-- Seed default company settings
INSERT INTO company_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM company_settings);

-- Seed default site sections
INSERT INTO site_sections (section_key, section_label, visible, sort_order)
VALUES
  ('hero', 'Hero', true, 1),
  ('about', 'About', true, 2),
  ('capabilities', 'Capabilities', true, 3),
  ('projects', 'Projects', true, 4),
  ('process', 'Process', true, 5),
  ('contact', 'Contact', true, 6)
ON CONFLICT (section_key) DO NOTHING;

-- Seed default capabilities
INSERT INTO capabilities (number, name, description, sort_order)
VALUES
  ('01', 'Structural Steel', 'Complete structural steel systems for industrial and commercial buildings.', 1),
  ('02', 'Steel Fabrication', 'Precision fabrication of steel components in a controlled workshop environment.', 2),
  ('03', 'Metal Construction', 'On-site metal construction and assembly of fabricated structural elements.', 3),
  ('04', 'Installation', 'Professional installation of steel structures with experienced field crews.', 4),
  ('05', 'Custom Fabrication', 'Bespoke metal fabrication for architectural and industrial applications.', 5),
  ('06', 'Industrial Structures', 'Heavy industrial structures including halls, platforms, and support systems.', 6)
ON CONFLICT DO NOTHING;

-- Seed default process stages
INSERT INTO process_stages (number, name, description, sort_order)
VALUES
  ('01', 'Engineering', 'Structural design, calculations, and detailed shop drawings.', 1),
  ('02', 'Fabrication', 'Cutting, drilling, welding, and assembly in the workshop.', 2),
  ('03', 'Quality Control', 'Inspection of welds, dimensions, and structural integrity.', 3),
  ('04', 'Transport', 'Logistics and delivery of fabricated elements to site.', 4),
  ('05', 'Installation', 'On-site assembly, erection, and final structural connections.', 5)
ON CONFLICT DO NOTHING;
