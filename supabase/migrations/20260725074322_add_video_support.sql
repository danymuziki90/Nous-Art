/*
# Add media_type column and art-videos storage bucket

1. Modified Tables
- `art_pieces`
  - Add `media_type` (text, default 'image') — either 'image' or 'video'.
  - Allows the gallery to display both still works and video clips.

2. Storage
- Create a public bucket `art-videos` for video clip uploads.

3. Security
- `art_pieces` policies unchanged (already allow public read, admin write).
- Storage bucket `art-videos`: public read; only authenticated can upload/update/delete.
*/

ALTER TABLE art_pieces
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';

INSERT INTO storage.buckets (id, name, public)
VALUES ('art-videos', 'art-videos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_art_videos" ON storage.objects;
CREATE POLICY "public_read_art_videos" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'art-videos');

DROP POLICY IF EXISTS "admin_insert_art_videos" ON storage.objects;
CREATE POLICY "admin_insert_art_videos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'art-videos');

DROP POLICY IF EXISTS "admin_update_art_videos" ON storage.objects;
CREATE POLICY "admin_update_art_videos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'art-videos') WITH CHECK (bucket_id = 'art-videos');

DROP POLICY IF EXISTS "admin_delete_art_videos" ON storage.objects;
CREATE POLICY "admin_delete_art_videos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'art-videos');
