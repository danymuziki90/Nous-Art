/*
# Create art_pieces table and public storage bucket for NOUS ART

1. New Tables
- `art_pieces`
  - `id` (uuid, primary key)
  - `title` (text, not null) — title of the artwork
  - `artist` (text, not null) — artist name
  - `description` (text) — curatorial description
  - `year` (int) — year of creation
  - `medium` (text) — e.g. "Oil on canvas"
  - `dimensions` (text) — e.g. "120 x 90 cm"
  - `price` (numeric) — asking price (nullable for NFS works)
  - `image_url` (text, not null) — public URL of the artwork image
  - `category` (text) — e.g. "Painting", "Sculpture", "Photography"
  - `featured` (boolean, default false) — shown on the home page
  - `created_at` (timestamptz)

2. Storage
- Create a public bucket `art-images` for artwork image uploads.

3. Security
- Enable RLS on `art_pieces`.
- Public (anon + authenticated) can SELECT — gallery is publicly viewable.
- Only authenticated (admin) can INSERT / UPDATE / DELETE.
- Storage bucket policies: public read; only authenticated can upload/update/delete.
*/

CREATE TABLE IF NOT EXISTS art_pieces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  description text,
  year int,
  medium text,
  dimensions text,
  price numeric(12, 2),
  image_url text NOT NULL,
  category text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE art_pieces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_art_pieces" ON art_pieces;
CREATE POLICY "public_read_art_pieces" ON art_pieces
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_art_pieces" ON art_pieces;
CREATE POLICY "admin_insert_art_pieces" ON art_pieces
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_art_pieces" ON art_pieces;
CREATE POLICY "admin_update_art_pieces" ON art_pieces
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_art_pieces" ON art_pieces;
CREATE POLICY "admin_delete_art_pieces" ON art_pieces
  FOR DELETE TO authenticated USING (true);

-- Storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public)
VALUES ('art-images', 'art-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "public_read_art_images" ON storage.objects;
CREATE POLICY "public_read_art_images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'art-images');

DROP POLICY IF EXISTS "admin_insert_art_images" ON storage.objects;
CREATE POLICY "admin_insert_art_images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'art-images');

DROP POLICY IF EXISTS "admin_update_art_images" ON storage.objects;
CREATE POLICY "admin_update_art_images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'art-images') WITH CHECK (bucket_id = 'art-images');

DROP POLICY IF EXISTS "admin_delete_art_images" ON storage.objects;
CREATE POLICY "admin_delete_art_images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'art-images');
