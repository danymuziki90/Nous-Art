export interface Artist {
  id: string;
  name: string;
  portrait: string;
  location: string;
  shortBio: string;
  biography: string[];
  artisticBackground: string;
  styleAndApproach: string;
  mainMediums: string[];
  achievements: {
    year: string;
    title: string;
    venue: string;
  }[];
  quote: string;
  discipline: 'Painting' | 'Sculpture' | 'Photography' | 'Mixed Media' | 'Drawing';
  featured: boolean;
}

export const ARTISTS: Artist[] = [
  {
    id: 'elena-marchetti',
    name: 'Elena Marchetti',
    portrait: '/artists/elena-marchetti.png',
    location: 'Milan, Italy • b. 1982',
    shortBio: 'Exploring atmospheric abstraction through layered ochres, raw pigments, and oxidized beeswax on unprimed canvas.',
    biography: [
      'Elena Marchetti is an Italian abstract painter whose work investigates the intersection of memory, mineral materiality, and spatial silence. Born in Milan and educated at the Accademia di Belle Arti di Brera, Marchetti developed an idiosyncratic technique that blends natural earth pigments with Venetian plaster and natural beeswax.',
      'Her paintings evoke ancient architectural ruins and atmospheric weather systems. Rather than depicting landscapes directly, Marchetti distills environmental sensations into subtle tonal gradations and tactile, eroded surfaces. Her works invite contemplative engagement, serving as visual sanctuaries of quietude and emotional depth.'
    ],
    artisticBackground: 'MFA in Fine Art Painting from Accademia di Belle Arti di Brera, Milan. Trained under master restorers of Italian Renaissance frescoes.',
    styleAndApproach: 'Lyrical Abstract Expressionism characterized by subtle earth tones, impasto textures, and organic geometric balance created with natural mineral pigments.',
    mainMediums: ['Oil & Mineral Pigments', 'Venetian Plaster', 'Beeswax on Linen', 'Raw Canvas'],
    achievements: [
      { year: '2025', title: 'Solo Exhibition: Silent Earth', venue: 'Palazzo Reale, Milan' },
      { year: '2024', title: 'Venice Biennale - Italian Pavilion Feature', venue: 'La Biennale di Venezia' },
      { year: '2022', title: 'European Painting Prize Laureate', venue: 'Fondation Cartier, Paris' },
      { year: '2020', title: 'Permanent Acquisition', venue: 'Museo del Novecento, Milan' },
    ],
    quote: 'Paint is not merely color on a surface; it is compressed time, light, and mineral memory speaking to the spirit.',
    discipline: 'Painting',
    featured: true,
  },
  {
    id: 'hiroshi-tanaka',
    name: 'Hiroshi Tanaka',
    portrait: '/artists/hiroshi-tanaka.png',
    location: 'Kyoto, Japan • b. 1976',
    shortBio: 'Minimalist sculptor crafting meditative bronze, charred cypress, and polished obsidian forms celebrating spatial harmony.',
    biography: [
      'Hiroshi Tanaka is a Kyoto-born contemporary sculptor whose work bridges traditional Japanese philosophy—specifically Wabi-Sabi and Ma (negative space)—with modernist architectural minimalism.',
      'Working primarily with cast bronze, hand-charred Yakusugi cypress, and volcanic obsidian, Tanaka creates monolithic sculptures that react dynamically to ambient light. His minimalist forms encourage viewers to observe the space surrounding the artwork as intensely as the artwork itself.'
    ],
    artisticBackground: 'Apprenticed with traditional master stonemasons in Kyoto before graduating from Tokyo University of the Arts (Geidai).',
    styleAndApproach: 'Architectural Minimalism focusing on negative space, tactile contrast between rough raw stone and mirror-polished bronze, and temporal impermanence.',
    mainMediums: ['Cast Bronze', 'Shou Sugi Ban Cypress', 'Polished Obsidian', 'Raw Granite'],
    achievements: [
      { year: '2025', title: 'Solo Sculpture Survey: The Shape of Silence', venue: 'Mori Art Museum, Tokyo' },
      { year: '2023', title: 'International Public Sculpture Commission', venue: 'Kyoto National Museum Gardens' },
      { year: '2021', title: 'Praemium Imperiale Grant for Emerging Sculptors', venue: 'Japan Art Association' },
    ],
    quote: 'In sculpture, what is carved away holds equal weight to what remains. Space is the living vessel of form.',
    discipline: 'Sculpture',
    featured: true,
  },
  {
    id: 'sofia-almeida',
    name: 'Sofia Almeida',
    portrait: '/artists/sofia-almeida.png',
    location: 'Lisbon, Portugal • b. 1988',
    shortBio: 'Fine art photographer capturing ethereal light, architectural shadows, and solitary coastal landscapes on large-format film.',
    biography: [
      'Sofia Almeida is a Portuguese fine art photographer renowned for her contemplative, large-format film photography capturing the poetic interplay of oceanic light and brutalist coastal architecture.',
      'Eschewing digital manipulation, Almeida works exclusively with an 8x10 wooden field camera and silver gelatin printing processes. Her images evoke a profound sense of solitude, timelessness, and sublime atmosphere, turning physical landscapes into interior psychological reflections.'
    ],
    artisticBackground: 'MA in Photography from the Royal College of Art, London. Recipient of the Hasselblad Foundation Research Fellowship.',
    styleAndApproach: 'Atmospheric Fine Art Photography using long exposure, analog silver gelatin prints, and dramatic natural chiaroscuro.',
    mainMediums: ['Silver Gelatin Prints', 'Archival Pigment Prints', '8x10 Large Format Film'],
    achievements: [
      { year: '2025', title: 'Solo Exhibition: Atlantic Solitude', venue: 'Museu Berardo, Lisbon' },
      { year: '2023', title: 'Prix Pictet Shortlist Nominee', venue: 'V&A Museum, London' },
      { year: '2022', title: 'Monograph Publication: The Weight of Light', venue: 'Aperture Foundation' },
    ],
    quote: 'Light does not merely illuminate objects; it reveals the unseen silence between moments.',
    discipline: 'Photography',
    featured: true,
  },
  {
    id: 'marcus-vale',
    name: 'Marcus Vale',
    portrait: '/artists/marcus-vale.png',
    location: 'Berlin, Germany • b. 1980',
    shortBio: 'Neo-expressionist master blending visceral gestural marks with architectural structure and raw emotional intensity.',
    biography: [
      'Marcus Vale is a German painter whose monumentally scaled canvases combine raw neo-expressionist brushwork with rigorous geometric underpinnings.',
      'Based in a cavernous studio in Berlin-Kreuzberg, Vale builds complex compositions through dozens of translucent layers of oil, graphite, and industrial charcoal. His work addresses themes of urban decay, psychological tension, and the resilience of human emotion in modern metropolis environments.'
    ],
    artisticBackground: 'Studied under Anselm Kiefer at the Universität der Künste (UdK) Berlin.',
    styleAndApproach: 'Neo-Expressionist Gesture Painting featuring dramatic scale, high-contrast chiaroscuro, and raw charcoal underdrawings.',
    mainMediums: ['Oil on Linen', 'Industrial Charcoal', 'Graphite & Oil Stick'],
    achievements: [
      { year: '2024', title: 'Solo Retrospective: Concrete & Echoes', venue: 'Hamburger Bahnhof, Berlin' },
      { year: '2022', title: 'Art Basel Statement Feature', venue: 'Messe Basel, Switzerland' },
      { year: '2019', title: 'Käthe Kollwitz Prize', venue: 'Akademie der Künste, Berlin' },
    ],
    quote: 'A canvas must be fought for. Every line is a gesture of survival against silence.',
    discipline: 'Painting',
    featured: true,
  },
  {
    id: 'yara-okonkwo',
    name: 'Yara Okonkwo',
    portrait: '/artists/yara-okonkwo.png',
    location: 'London / Lagos • b. 1985',
    shortBio: 'Contemporary textile and color field artist weaving cultural heritage with luminous color dynamics.',
    biography: [
      'Yara Okonkwo is a Nigerian-British multidisciplinary artist whose vibrant color field compositions and woven textile installations explore memory, diaspora identity, and geometric symbolism.',
      'Splitting her time between London and Lagos, Okonkwo combines hand-dyed indigo, metallic threads, and acrylic pigments on handwoven cotton fabrics. Her striking visual language draws equally from traditional West African weaving motifs and mid-century Western Color Field abstraction.'
    ],
    artisticBackground: 'BFA from Slade School of Fine Art, London; Postgraduate studies in traditional textile techniques in Osogbo, Nigeria.',
    styleAndApproach: 'Luminous Color Field Textiles & Acrylic Painting blending structured geometry with organic fiber textures.',
    mainMediums: ['Hand-Dyed Cotton Fiber', 'Acrylic on Canvas', 'Gold Thread & Pigment'],
    achievements: [
      { year: '2025', title: 'Commission: Threaded Memory', venue: 'Tate Modern, London' },
      { year: '2023', title: 'Frieze Artist Award Finalist', venue: 'Frieze London' },
      { year: '2021', title: 'Dakar Biennale Grand Prize', venue: 'Dak’Art Biennale' },
    ],
    quote: 'Threads are memory paths. Color is the frequency through which ancestry speaks to the future.',
    discipline: 'Mixed Media',
    featured: true,
  },
];

export function getAllArtists(): Artist[] {
  return ARTISTS;
}

export function getArtistById(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id.toLowerCase() === id.toLowerCase());
}

export function slugifyArtistName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getArtistByName(name: string): Artist | undefined {
  const slug = slugifyArtistName(name);
  const found = ARTISTS.find((a) => a.id === slug || a.name.toLowerCase() === name.toLowerCase());
  if (found) return found;
  
  // Fuzzy match fallback
  return ARTISTS.find((a) => a.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(a.name.toLowerCase()));
}
