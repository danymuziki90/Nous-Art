import { getR2MediaUrl } from '@/lib/r2Storage';

export interface MediumCategory {
  id: string;
  title: string;
  medium: string;
  count: string;
  tagline: string;
  image: string;
  featuredArtist: string;
  iconName: 'Palette' | 'Box' | 'Camera' | 'Stamp' | 'Feather' | 'Sparkles';
}

export const INITIAL_MEDIUMS: MediumCategory[] = [
  {
    id: 'paintings',
    title: 'Paintings',
    medium: 'Painting',
    count: '45+ Original Works',
    tagline: 'Gestural canvases, impasto textures, and expansive color field explorations.',
    image: getR2MediaUrl('https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    featuredArtist: 'Elena Marchetti',
    iconName: 'Palette',
  },
  {
    id: 'sculptures',
    title: 'Sculptures',
    medium: 'Sculpture',
    count: '24+ Three-Dimensional Works',
    tagline: 'Patinated bronze castings, carved statuary marble, and spatial installations.',
    image: getR2MediaUrl('https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    featuredArtist: 'Hiroshi Tanaka',
    iconName: 'Box',
  },
  {
    id: 'photography',
    title: 'Photography',
    medium: 'Photography',
    count: '32+ Fine Art Prints',
    tagline: 'Architectural geometry, surreal portraiture, and large-format chromogenic prints.',
    image: getR2MediaUrl('https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    featuredArtist: 'Sofia Almeida',
    iconName: 'Camera',
  },
  {
    id: 'editions',
    title: 'Limited Editions',
    medium: 'Edition',
    count: '18+ Signed Editions',
    tagline: 'Exclusive serigraphs, etchings, lithographs, and museum-grade archival prints.',
    image: getR2MediaUrl('https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    featuredArtist: 'Marcus Vale',
    iconName: 'Stamp',
  },
  {
    id: 'drawings',
    title: 'Drawings & Paper',
    medium: 'Drawing',
    count: '15+ Works on Paper',
    tagline: 'Raw charcoal studies, ink linework, and delicate mixed-media compositions.',
    image: getR2MediaUrl('https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    featuredArtist: 'Yara Okonkwo',
    iconName: 'Feather',
  },
];
