/*
# Create site_settings table for hero media

1. New Tables
- `site_settings`
  - `id` (int, primary key, always 1) — single-row config table.
  - `hero_media_url` (text) — URL of the hero background (image or video).
  - `hero_media_type` (text, default 'image') — either 'image' or 'video'.
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `site_settings`.
- Public (anon + authenticated) can SELECT — hero must render for all visitors.
- Only authenticated (admin) can INSERT / UPDATE.
- DELETE not needed; the single row is never removed.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_media_url text,
  hero_media_type text NOT NULL DEFAULT 'image',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Seed the single row with the default hero image so the home page always has a background.
INSERT INTO site_settings (id, hero_media_url, hero_media_type)
VALUES (1, 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=2000', 'image')
ON CONFLICT (id) DO NOTHING;
