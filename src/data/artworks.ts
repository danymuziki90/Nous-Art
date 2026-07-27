import { getR2MediaUrl } from '@/lib/r2Storage';

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

export interface SiteSettings {
  id: number;
  hero_media_url: string | null;
  hero_media_type: 'image' | 'video';
  updated_at: string;
}

export const INITIAL_ARTWORKS: ArtPiece[] = [
  {
    id: 'f3678546-0c46-4ef3-b1fa-60b3beeddf8c',
    title: 'Reverie in Ochre',
    artist: 'Elena Marchetti',
    description: 'Layered natural earth pigments, Venetian plaster, and oxidized beeswax on unprimed Italian linen. Investigating memory, mineral materiality, and spatial silence.',
    year: 2024,
    medium: 'Oil & Beeswax on Linen',
    dimensions: '180 × 140 cm',
    price: 18500,
    image_url: getR2MediaUrl('https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    category: 'Painting',
    featured: true,
    media_type: 'image',
    created_at: '2026-07-25T07:29:19.000Z',
  },
  {
    id: '9e26311f-6302-4607-a392-b04b7c11d7fe',
    title: 'Untitled (Fragment VII)',
    artist: 'Hiroshi Tanaka',
    description: 'Cast bronze with hand-charred Yakusugi cypress base. Minimalist architectural form exploring the interplay of light and negative space.',
    year: 2025,
    medium: 'Cast Bronze & Charred Cypress',
    dimensions: '65 × 35 × 30 cm',
    price: 24000,
    image_url: getR2MediaUrl('https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    category: 'Sculpture',
    featured: true,
    media_type: 'image',
    created_at: '2026-07-25T07:35:10.000Z',
  },
  {
    id: '83f4222f-d301-47d8-ae4e-1248e60b8293',
    title: 'The Long Afternoon',
    artist: 'Sofia Almeida',
    description: 'Ethereal analog silver gelatin print captured on 8x10 wooden field camera along the Atlantic coast. Evoking sublime solitude and temporal grace.',
    year: 2023,
    medium: 'Silver Gelatin Print',
    dimensions: '120 × 90 cm (Edition 1 of 5)',
    price: 9200,
    image_url: getR2MediaUrl('https://images.pexels.com/photos/2901935/pexels-photo-2901935.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    category: 'Photography',
    featured: true,
    media_type: 'image',
    created_at: '2026-07-25T07:40:00.000Z',
  },
  {
    id: 'b56f0234-dd99-48b6-8127-efea05f53815',
    title: 'Stone Upon Stone',
    artist: 'Marcus Vale',
    description: 'Visceral neo-expressionist gestural marks layered with industrial charcoal, graphite, and raw pigments on monumental Belgian linen.',
    year: 2024,
    medium: 'Oil & Charcoal on Linen',
    dimensions: '210 × 160 cm',
    price: 31000,
    image_url: getR2MediaUrl('https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    category: 'Painting',
    featured: true,
    media_type: 'image',
    created_at: '2026-07-25T07:42:00.000Z',
  },
  {
    id: '14306832-c8a6-45b5-90e4-a644a3701ddb',
    title: 'Cadmium Field',
    artist: 'Yara Okonkwo',
    description: 'Hand-dyed cotton fiber, woven gold thread, and vibrant acrylic color fields exploring memory, diaspora identity, and geometric symbolism.',
    year: 2025,
    medium: 'Hand-Dyed Cotton & Acrylic',
    dimensions: '150 × 150 cm',
    price: 14500,
    image_url: getR2MediaUrl('https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    category: 'Mixed Media',
    featured: true,
    media_type: 'image',
    created_at: '2026-07-25T07:45:00.000Z',
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 1,
  hero_media_url: getR2MediaUrl('https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600'),
  hero_media_type: 'image',
  updated_at: new Date().toISOString(),
};

export function getAllArtworks(): ArtPiece[] {
  return INITIAL_ARTWORKS;
}

export function getArtworkById(id: string): ArtPiece | undefined {
  return INITIAL_ARTWORKS.find((piece) => piece.id === id);
}

export function getArtworksByArtist(artistName: string): ArtPiece[] {
  const norm = artistName.toLowerCase().trim();
  return INITIAL_ARTWORKS.filter((piece) => piece.artist.toLowerCase().includes(norm));
}

export function getFeaturedArtworks(): ArtPiece[] {
  return INITIAL_ARTWORKS.filter((piece) => piece.featured);
}

export function getRelatedArtworks(currentId: string, category?: string | null, limit: number = 3): ArtPiece[] {
  return INITIAL_ARTWORKS.filter(
    (piece) => piece.id !== currentId && (!category || piece.category === category)
  ).slice(0, limit);
}

export function getSiteSettings(): SiteSettings {
  return DEFAULT_SITE_SETTINGS;
}
