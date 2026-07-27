import { getR2MediaUrl } from '@/lib/r2Storage';

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  curator: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'Current' | 'Upcoming' | 'Past';
  coverImage: string;
  description: string;
  featuredArtworkIds: string[];
}

export const INITIAL_EXHIBITIONS: Exhibition[] = [
  {
    id: 'ex-01',
    title: 'Silent Earth & Mineral Time',
    subtitle: 'A major retrospective of atmospheric abstraction and raw pigment practices',
    curator: 'Isabella Vance',
    startDate: '2026-06-15',
    endDate: '2026-09-30',
    location: 'Main Gallery • Hall A',
    status: 'Current',
    coverImage: getR2MediaUrl('https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    description: 'This exhibition brings together monumental canvases and mineral plaster sculptures that investigate memory, geological erosion, and spatial stillness. Featuring new works by Elena Marchetti and Marcus Vale.',
    featuredArtworkIds: ['f3678546-0c46-4ef3-b1fa-60b3beeddf8c', 'b56f0234-dd99-48b6-8127-efea05f53815'],
  },
  {
    id: 'ex-02',
    title: 'The Weight of Light',
    subtitle: 'Large format silver gelatin photography and coastal architecture',
    curator: 'Jean-Luc Moreau',
    startDate: '2026-10-10',
    endDate: '2026-12-20',
    location: 'West Wing Pavilion',
    status: 'Upcoming',
    coverImage: getR2MediaUrl('https://images.pexels.com/photos/2901935/pexels-photo-2901935.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    description: 'An immersive survey of 8x10 analog photography capturing the intersection of Atlantic oceanic light and brutalist coastal structures by Sofia Almeida.',
    featuredArtworkIds: ['83f4222f-d301-47d8-ae4e-1248e60b8293'],
  },
  {
    id: 'ex-03',
    title: 'Monolithic Silence: Bronze & Cypress',
    subtitle: 'Spatial harmony and Japanese architectural minimalism',
    curator: 'Kenzo Takeda',
    startDate: '2026-01-10',
    endDate: '2026-04-30',
    location: 'Sculpture Garden & Atrium',
    status: 'Past',
    coverImage: getR2MediaUrl('https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=1600'),
    description: 'Exploring negative space (Ma) through hand-charred Yakusugi cypress, cast bronze, and volcanic obsidian forms by Hiroshi Tanaka.',
    featuredArtworkIds: ['9e26311f-6302-4607-a392-b04b7c11d7fe'],
  },
];

export function getAllExhibitions(): Exhibition[] {
  return INITIAL_EXHIBITIONS;
}

export function getExhibitionById(id: string): Exhibition | undefined {
  return INITIAL_EXHIBITIONS.find((e) => e.id === id);
}
