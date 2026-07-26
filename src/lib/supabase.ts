import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  year: number | null;
  medium: string | null;
  dimensions: string | null;
  price: number | null;
  image_url: string;
  category: string | null;
  featured: boolean;
  media_type: 'image' | 'video';
  created_at: string;
}

export type ArtPieceInput = Omit<ArtPiece, 'id' | 'created_at'>;

export interface SiteSettings {
  id: number;
  hero_media_url: string | null;
  hero_media_type: 'image' | 'video';
  updated_at: string;
}
