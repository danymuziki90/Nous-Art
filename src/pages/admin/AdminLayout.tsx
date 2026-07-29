import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useCMS } from '@/context/CMSContext';
import {
  LayoutDashboard,
  Palette,
  Users,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Cloud,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const { adminUser, logout } = useAdminAuth();
  const { loading: cmsLoading, syncing: cmsSyncing } = useCMS();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/nart-admin/login');
  };

  const navItems = [
    { label: 'Overview', to: '/nart-admin', icon: LayoutDashboard, end: true },
    { label: 'Artwork Catalog', to: '/nart-admin/artworks', icon: Palette },
    { label: 'Artist Roster', to: '/nart-admin/artists', icon: Users },
    { label: 'Exhibitions', to: '/nart-admin/exhibitions', icon: Calendar },
    { label: 'Site Settings', to: '/nart-admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ink-950 text-ink-50 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-ink-900 border-b border-white/10 p-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <img
            src="/img/logo.jpeg"
            alt="NOUS ART Logo"
            className="w-8 h-8 rounded-lg object-cover border border-gold-500/30 shadow-md"
          />
          <span className="font-display text-lg text-ink-50">NOUS ART CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-ink-200 hover:text-gold-300 focus:outline-none"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-ink-900/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-6 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="pb-6 border-b border-white/10 mb-6">
            <Link to="/nart-admin" className="flex items-center gap-3">
              <img
                src="/img/logo.jpeg"
                alt="NOUS ART Logo"
                className="w-10 h-10 rounded-xl object-cover border border-gold-500/30 shadow-md"
              />
              <div>
                <h1 className="font-display text-xl text-ink-50 font-light tracking-wide">NOUS ART</h1>
                <span className="text-[10px] font-mono text-gold-400 tracking-widest uppercase block">
                  Back Office CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 ${
                      isActive
                        ? 'bg-gold-500/15 border border-gold-500/40 text-gold-300 font-bold shadow-md shadow-gold-500/10'
                        : 'text-ink-300 hover:text-ink-50 hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          {/* System Status Indicators */}
          <div className="space-y-2 text-[10px] font-mono text-ink-300">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-ink-950 border border-white/5">
              <div className="flex items-center gap-2 text-gold-400">
                {cmsSyncing || cmsLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <ShieldCheck size={12} />
                )}
                <span>CMS Sync</span>
              </div>
              {cmsLoading ? (
                <span className="text-amber-400 font-bold">Loading…</span>
              ) : cmsSyncing ? (
                <span className="text-amber-400 font-bold">Syncing…</span>
              ) : (
                <span className="text-emerald-400 font-bold">Live ✓</span>
              )}
            </div>
          </div>

          {/* Public Site Link */}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-gold-500/40 text-xs text-ink-200 hover:text-gold-300 transition-all font-mono"
          >
            <span>Public Website</span>
            <ExternalLink size={14} />
          </Link>

          {/* User Account & Logout */}
          <div className="flex items-center justify-between pt-2">
            <div className="min-w-0 pr-2">
              <p className="text-xs text-ink-100 font-display font-medium truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-ink-400 font-mono truncate">{adminUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
