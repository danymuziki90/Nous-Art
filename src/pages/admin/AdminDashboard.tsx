import { Link } from 'react-router-dom';
import {
  Palette,
  Users,
  Calendar,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Film,
  Image as ImageIcon,
} from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { SEO } from '@/components/SEO';

export default function AdminDashboard() {
  const { artworks, artists, exhibitions, siteSettings, resetToDefaults } = useCMS();

  const currentExhibitions = exhibitions.filter((e) => e.status === 'Current');

  return (
    <>
      <SEO title="Overview Dashboard — NOUS ART CMS" description="CMS Back Office Overview" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-mono uppercase tracking-widest mb-2">
              <span>Back Office Executive Suite</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-ink-50 font-light">
              System Overview & <span className="font-serif italic gold-text-gradient">Analytics</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="btn-gold-outline flex items-center gap-2 py-2 px-4 text-xs rounded-lg"
              title="Reset state to initial seed catalog"
            >
              <RotateCcw size={14} />
              <span>Reset Seed Data</span>
            </button>
            <Link
              to="/admin/artworks"
              className="btn-gold flex items-center gap-2 py-2 px-4 text-xs rounded-lg"
            >
              <Plus size={14} />
              <span>Add Artwork</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Artworks */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-400 block mb-1">
                Active Artworks
              </span>
              <span className="font-display text-4xl text-gold-400 font-light">{artworks.length}</span>
              <span className="text-[11px] text-ink-300 font-mono block mt-1">Catalog Items</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <Palette size={22} />
            </div>
          </div>

          {/* Card 2: Artists */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-400 block mb-1">
                Represented Artists
              </span>
              <span className="font-display text-4xl text-ink-50 font-light">{artists.length}</span>
              <span className="text-[11px] text-ink-300 font-mono block mt-1">Global Roster</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-ink-100 shrink-0">
              <Users size={22} />
            </div>
          </div>

          {/* Card 3: Exhibitions */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-400 block mb-1">
                Current Exhibitions
              </span>
              <span className="font-display text-4xl text-emerald-400 font-light">
                {currentExhibitions.length}
              </span>
              <span className="text-[11px] text-ink-300 font-mono block mt-1">
                {exhibitions.length} Total Exhibitions
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Calendar size={22} />
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Manage Artworks */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  <Palette size={18} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink-50 font-medium">Artwork Management</h3>
                  <p className="text-xs text-ink-400 font-mono">Catalog & Marketplace</p>
                </div>
              </div>
              <p className="text-xs text-ink-300 leading-relaxed font-light mb-6">
                Add, edit, or delete artworks. Upload photos to Cloudflare R2 and update prices and dimensions.
              </p>
            </div>
            <Link
              to="/admin/artworks"
              className="w-full btn-gold group flex items-center justify-center gap-2 py-2.5 text-xs rounded-xl font-bold"
            >
              <span>Manage Artworks ({artworks.length})</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Column 2: Manage Artists */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-ink-100">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink-50 font-medium">Artist Roster</h3>
                  <p className="text-xs text-ink-400 font-mono">Profiles & Bios</p>
                </div>
              </div>
              <p className="text-xs text-ink-300 leading-relaxed font-light mb-6">
                Manage artist profiles, studio portraits, biographies, artistic styles, and museum records.
              </p>
            </div>
            <Link
              to="/admin/artists"
              className="w-full btn-gold-outline group flex items-center justify-center gap-2 py-2.5 text-xs rounded-xl font-bold"
            >
              <span>Manage Artists ({artists.length})</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Column 3: Manage Exhibitions */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink-50 font-medium">Exhibitions</h3>
                  <p className="text-xs text-ink-400 font-mono">Gallery Programme</p>
                </div>
              </div>
              <p className="text-xs text-ink-300 leading-relaxed font-light mb-6">
                Create and schedule exhibitions, upload cover photos to Cloudflare R2, and assign artworks.
              </p>
            </div>
            <Link
              to="/admin/exhibitions"
              className="w-full btn-gold-outline group flex items-center justify-center gap-2 py-2.5 text-xs rounded-xl font-bold"
            >
              <span>Manage Exhibitions ({exhibitions.length})</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Hero & Media Banner Configuration */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display text-2xl text-ink-50 font-light">Hero Media & Site Configuration</h3>
              <p className="text-xs font-mono text-ink-400 mt-1">Current Public Website Banner Media</p>
            </div>
            <Link to="/admin/settings" className="btn-gold-outline py-2 px-4 text-xs rounded-lg">
              Edit Settings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-ink-900">
              {siteSettings.hero_media_type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-ink-900 text-gold-400 gap-2">
                  <Film size={24} />
                  <span className="font-mono text-xs">Video Background</span>
                </div>
              ) : (
                <img
                  src={siteSettings.hero_media_url || ''}
                  alt="Hero Banner Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="space-y-3 font-mono text-xs text-ink-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Media Type:</span>
                <span className="text-gold-400 font-bold uppercase">{siteSettings.hero_media_type}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Storage Host:</span>
                <span className="text-emerald-400 font-bold">Cloudflare R2 CDN</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Last Updated:</span>
                <span className="text-ink-200">{new Date(siteSettings.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
