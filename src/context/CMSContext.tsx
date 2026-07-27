import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ARTWORKS, DEFAULT_SITE_SETTINGS, type ArtPiece, type SiteSettings } from '@/data/artworks';
import { ARTISTS, type Artist } from '@/data/artists';
import { INITIAL_EXHIBITIONS, type Exhibition } from '@/data/exhibitions';
import { INITIAL_MEDIUMS, type MediumCategory } from '@/data/mediums';

interface CMSContextType {
  artworks: ArtPiece[];
  artists: Artist[];
  exhibitions: Exhibition[];
  mediumCategories: MediumCategory[];
  siteSettings: SiteSettings;

  // Artwork CRUD
  addArtwork: (artwork: Omit<ArtPiece, 'id' | 'created_at'>) => ArtPiece;
  updateArtwork: (id: string, updates: Partial<ArtPiece>) => void;
  deleteArtwork: (id: string) => void;
  getArtworkById: (id: string) => ArtPiece | undefined;
  getArtworksByArtist: (artistName: string) => ArtPiece[];

  // Artist CRUD
  addArtist: (artist: Omit<Artist, 'id'>) => Artist;
  updateArtist: (id: string, updates: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;
  getArtistById: (id: string) => Artist | undefined;

  // Exhibition CRUD
  addExhibition: (exhibition: Omit<Exhibition, 'id'>) => Exhibition;
  updateExhibition: (id: string, updates: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  getExhibitionById: (id: string) => Exhibition | undefined;

  // Medium Category CRUD
  addMediumCategory: (medium: Omit<MediumCategory, 'id'>) => MediumCategory;
  updateMediumCategory: (id: string, updates: Partial<MediumCategory>) => void;
  deleteMediumCategory: (id: string) => void;

  // Site Settings
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Artworks state
  const [artworks, setArtworks] = useState<ArtPiece[]>(() => {
    try {
      const saved = localStorage.getItem('nous_art_cms_artworks');
      return saved ? JSON.parse(saved) : INITIAL_ARTWORKS;
    } catch {
      return INITIAL_ARTWORKS;
    }
  });

  // Artists state
  const [artists, setArtists] = useState<Artist[]>(() => {
    try {
      const saved = localStorage.getItem('nous_art_cms_artists');
      return saved ? JSON.parse(saved) : ARTISTS;
    } catch {
      return ARTISTS;
    }
  });

  // Exhibitions state
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(() => {
    try {
      const saved = localStorage.getItem('nous_art_cms_exhibitions');
      return saved ? JSON.parse(saved) : INITIAL_EXHIBITIONS;
    } catch {
      return INITIAL_EXHIBITIONS;
    }
  });

  // Medium Categories state
  const [mediumCategories, setMediumCategories] = useState<MediumCategory[]>(() => {
    try {
      const saved = localStorage.getItem('nous_art_cms_mediums');
      return saved ? JSON.parse(saved) : INITIAL_MEDIUMS;
    } catch {
      return INITIAL_MEDIUMS;
    }
  });

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('nous_art_cms_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nous_art_cms_artworks', JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem('nous_art_cms_artists', JSON.stringify(artists));
  }, [artists]);

  useEffect(() => {
    localStorage.setItem('nous_art_cms_exhibitions', JSON.stringify(exhibitions));
  }, [exhibitions]);

  useEffect(() => {
    localStorage.setItem('nous_art_cms_mediums', JSON.stringify(mediumCategories));
  }, [mediumCategories]);

  useEffect(() => {
    localStorage.setItem('nous_art_cms_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // --- Artwork CRUD Operations ---
  const addArtwork = (data: Omit<ArtPiece, 'id' | 'created_at'>): ArtPiece => {
    const newArtwork: ArtPiece = {
      ...data,
      id: `art_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    setArtworks((prev) => [newArtwork, ...prev]);
    return newArtwork;
  };

  const updateArtwork = (id: string, updates: Partial<ArtPiece>) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((item) => item.id !== id));
  };

  const getArtworkById = (id: string) => artworks.find((item) => item.id === id);

  const getArtworksByArtist = (artistName: string) => {
    const norm = artistName.toLowerCase().trim();
    return artworks.filter((item) => item.artist.toLowerCase().includes(norm));
  };

  // --- Artist CRUD Operations ---
  const addArtist = (data: Omit<Artist, 'id'>): Artist => {
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
    const newArtist: Artist = {
      ...data,
      id: slug || `artist_${Date.now()}`,
    };
    setArtists((prev) => [newArtist, ...prev]);
    return newArtist;
  };

  const updateArtist = (id: string, updates: Partial<Artist>) => {
    setArtists((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteArtist = (id: string) => {
    setArtists((prev) => prev.filter((item) => item.id !== id));
  };

  const getArtistById = (id: string) => artists.find((item) => item.id === id);

  // --- Exhibition CRUD Operations ---
  const addExhibition = (data: Omit<Exhibition, 'id'>): Exhibition => {
    const newExhibition: Exhibition = {
      ...data,
      id: `ex_${Date.now()}`,
    };
    setExhibitions((prev) => [newExhibition, ...prev]);
    return newExhibition;
  };

  const updateExhibition = (id: string, updates: Partial<Exhibition>) => {
    setExhibitions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteExhibition = (id: string) => {
    setExhibitions((prev) => prev.filter((item) => item.id !== id));
  };

  const getExhibitionById = (id: string) => exhibitions.find((item) => item.id === id);

  // --- Medium Category CRUD Operations ---
  const addMediumCategory = (data: Omit<MediumCategory, 'id'>): MediumCategory => {
    const newMedium: MediumCategory = {
      ...data,
      id: `medium_${Date.now()}`,
    };
    setMediumCategories((prev) => [...prev, newMedium]);
    return newMedium;
  };

  const updateMediumCategory = (id: string, updates: Partial<MediumCategory>) => {
    setMediumCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMediumCategory = (id: string) => {
    setMediumCategories((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Site Settings ---
  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
  };

  const resetToDefaults = () => {
    setArtworks(INITIAL_ARTWORKS);
    setArtists(ARTISTS);
    setExhibitions(INITIAL_EXHIBITIONS);
    setMediumCategories(INITIAL_MEDIUMS);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    localStorage.removeItem('nous_art_cms_artworks');
    localStorage.removeItem('nous_art_cms_artists');
    localStorage.removeItem('nous_art_cms_exhibitions');
    localStorage.removeItem('nous_art_cms_mediums');
    localStorage.removeItem('nous_art_cms_settings');
  };

  return (
    <CMSContext.Provider
      value={{
        artworks,
        artists,
        exhibitions,
        mediumCategories,
        siteSettings,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        getArtworkById,
        getArtworksByArtist,
        addArtist,
        updateArtist,
        deleteArtist,
        getArtistById,
        addExhibition,
        updateExhibition,
        deleteExhibition,
        getExhibitionById,
        addMediumCategory,
        updateMediumCategory,
        deleteMediumCategory,
        updateSiteSettings,
        resetToDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
};
