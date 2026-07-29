import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_ARTWORKS, DEFAULT_SITE_SETTINGS, type ArtPiece, type SiteSettings } from '@/data/artworks';
import { ARTISTS, type Artist } from '@/data/artists';
import { INITIAL_EXHIBITIONS, type Exhibition } from '@/data/exhibitions';
import { INITIAL_MEDIUMS, type MediumCategory } from '@/data/mediums';
import { fetchCMSData, saveCMSData } from '@/lib/r2Storage';

interface CMSContextType {
  artworks: ArtPiece[];
  artists: Artist[];
  exhibitions: Exhibition[];
  mediumCategories: MediumCategory[];
  siteSettings: SiteSettings;

  /** true while the initial R2 data fetch is in progress */
  loading: boolean;
  /** true while a save to R2 is in progress */
  syncing: boolean;

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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Read from localStorage with a JSON parse fallback */
function readLocal<T>(key: string): T | null {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : null;
  } catch {
    return null;
  }
}

/** Write to localStorage (local cache) */
function writeLocal(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('[CMS] localStorage write failed:', err);
  }
}

// localStorage keys
const LS_ARTWORKS    = 'nous_art_cms_artworks';
const LS_ARTISTS     = 'nous_art_cms_artists';
const LS_EXHIBITIONS = 'nous_art_cms_exhibitions';
const LS_MEDIUMS     = 'nous_art_cms_mediums';
const LS_SETTINGS    = 'nous_art_cms_settings';

// ─── Provider ───────────────────────────────────────────────────────────────

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with localStorage data (fast) or hardcoded defaults
  const [artworks, setArtworks]             = useState<ArtPiece[]>(() => readLocal<ArtPiece[]>(LS_ARTWORKS) ?? INITIAL_ARTWORKS);
  const [artists, setArtists]               = useState<Artist[]>(() => readLocal<Artist[]>(LS_ARTISTS) ?? ARTISTS);
  const [exhibitions, setExhibitions]       = useState<Exhibition[]>(() => readLocal<Exhibition[]>(LS_EXHIBITIONS) ?? INITIAL_EXHIBITIONS);
  const [mediumCategories, setMediumCategories] = useState<MediumCategory[]>(() => readLocal<MediumCategory[]>(LS_MEDIUMS) ?? INITIAL_MEDIUMS);
  const [siteSettings, setSiteSettings]     = useState<SiteSettings>(() => readLocal<SiteSettings>(LS_SETTINGS) ?? DEFAULT_SITE_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Track whether the initial R2 load has completed, so we don't
  // trigger R2 saves from the setState calls during hydration.
  const hydrated = useRef(false);

  // ─── Phase 1: Load from R2 on mount (source of truth) ──────────────
  useEffect(() => {
    let cancelled = false;

    async function loadFromR2() {
      try {
        const [r2Artworks, r2Artists, r2Exhibitions, r2Mediums, r2Settings] = await Promise.all([
          fetchCMSData<ArtPiece[]>('artworks'),
          fetchCMSData<Artist[]>('artists'),
          fetchCMSData<Exhibition[]>('exhibitions'),
          fetchCMSData<MediumCategory[]>('mediums'),
          fetchCMSData<SiteSettings>('settings'),
        ]);

        if (cancelled) return;

        // If R2 returned data, use it. Otherwise check for localStorage data
        // that may need migration (admin previously saved to localStorage only).
        if (r2Artworks) {
          setArtworks(r2Artworks);
          writeLocal(LS_ARTWORKS, r2Artworks);
        } else {
          // Migration: if localStorage has non-default data, push it to R2
          const local = readLocal<ArtPiece[]>(LS_ARTWORKS);
          if (local && JSON.stringify(local) !== JSON.stringify(INITIAL_ARTWORKS)) {
            await saveCMSData('artworks', local);
          }
        }

        if (r2Artists) {
          setArtists(r2Artists);
          writeLocal(LS_ARTISTS, r2Artists);
        } else {
          const local = readLocal<Artist[]>(LS_ARTISTS);
          if (local && JSON.stringify(local) !== JSON.stringify(ARTISTS)) {
            await saveCMSData('artists', local);
          }
        }

        if (r2Exhibitions) {
          setExhibitions(r2Exhibitions);
          writeLocal(LS_EXHIBITIONS, r2Exhibitions);
        } else {
          const local = readLocal<Exhibition[]>(LS_EXHIBITIONS);
          if (local && JSON.stringify(local) !== JSON.stringify(INITIAL_EXHIBITIONS)) {
            await saveCMSData('exhibitions', local);
          }
        }

        if (r2Mediums) {
          setMediumCategories(r2Mediums);
          writeLocal(LS_MEDIUMS, r2Mediums);
        } else {
          const local = readLocal<MediumCategory[]>(LS_MEDIUMS);
          if (local && JSON.stringify(local) !== JSON.stringify(INITIAL_MEDIUMS)) {
            await saveCMSData('mediums', local);
          }
        }

        if (r2Settings) {
          setSiteSettings(r2Settings);
          writeLocal(LS_SETTINGS, r2Settings);
        } else {
          const local = readLocal<SiteSettings>(LS_SETTINGS);
          if (local && JSON.stringify(local) !== JSON.stringify(DEFAULT_SITE_SETTINGS)) {
            await saveCMSData('settings', local);
          }
        }
      } catch (err) {
        console.error('[CMS] Failed to load from R2, using local/default data:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          // Mark hydration complete after a tick so setState batching finishes
          setTimeout(() => { hydrated.current = true; }, 0);
        }
      }
    }

    loadFromR2();
    return () => { cancelled = true; };
  }, []);

  // ─── Phase 2: Sync to localStorage AND R2 on every change ─────────
  // We use a debounce-like approach: save immediately to localStorage,
  // and debounce R2 saves to avoid flooding the Worker.

  const syncTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const persistToR2 = useCallback((collection: 'artworks' | 'artists' | 'exhibitions' | 'mediums' | 'settings', data: unknown) => {
    // Don't save to R2 during initial hydration
    if (!hydrated.current) return;

    // Clear any pending save for this collection
    if (syncTimeouts.current[collection]) {
      clearTimeout(syncTimeouts.current[collection]);
    }

    // Debounce: save after 300ms of no further changes
    syncTimeouts.current[collection] = setTimeout(async () => {
      setSyncing(true);
      try {
        await saveCMSData(collection, data);
      } catch (err) {
        console.error(`[CMS] Failed to sync ${collection} to R2:`, err);
      } finally {
        setSyncing(false);
      }
    }, 300);
  }, []);

  // Sync artworks
  useEffect(() => {
    writeLocal(LS_ARTWORKS, artworks);
    persistToR2('artworks', artworks);
  }, [artworks, persistToR2]);

  // Sync artists
  useEffect(() => {
    writeLocal(LS_ARTISTS, artists);
    persistToR2('artists', artists);
  }, [artists, persistToR2]);

  // Sync exhibitions
  useEffect(() => {
    writeLocal(LS_EXHIBITIONS, exhibitions);
    persistToR2('exhibitions', exhibitions);
  }, [exhibitions, persistToR2]);

  // Sync medium categories
  useEffect(() => {
    writeLocal(LS_MEDIUMS, mediumCategories);
    persistToR2('mediums', mediumCategories);
  }, [mediumCategories, persistToR2]);

  // Sync site settings
  useEffect(() => {
    writeLocal(LS_SETTINGS, siteSettings);
    persistToR2('settings', siteSettings);
  }, [siteSettings, persistToR2]);

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
    localStorage.removeItem(LS_ARTWORKS);
    localStorage.removeItem(LS_ARTISTS);
    localStorage.removeItem(LS_EXHIBITIONS);
    localStorage.removeItem(LS_MEDIUMS);
    localStorage.removeItem(LS_SETTINGS);
    // Also reset R2 data
    saveCMSData('artworks', INITIAL_ARTWORKS);
    saveCMSData('artists', ARTISTS);
    saveCMSData('exhibitions', INITIAL_EXHIBITIONS);
    saveCMSData('mediums', INITIAL_MEDIUMS);
    saveCMSData('settings', DEFAULT_SITE_SETTINGS);
  };

  return (
    <CMSContext.Provider
      value={{
        artworks,
        artists,
        exhibitions,
        mediumCategories,
        siteSettings,
        loading,
        syncing,
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
