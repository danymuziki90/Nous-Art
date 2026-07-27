import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { SEO } from '@/components/SEO';

const DEFAULT_ADMIN_EMAIL = 'genzlismhq@gmail.com';
const DEFAULT_ADMIN_PASS = 'Gerse@2026';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login — NOUS ART Gallery CMS" description="Secure Back Office Login" />

      <div className="min-h-screen bg-ink-950 text-ink-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full glass-panel rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl relative z-10 fade-up">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-4 shadow-xl">
              <Sparkles size={26} />
            </div>
            <h1 className="font-display text-3xl text-ink-50 font-light tracking-tight">
              NOUS ART <span className="font-serif italic gold-text-gradient font-normal">Back Office</span>
            </h1>
            <p className="text-xs font-mono text-ink-400 uppercase tracking-widest mt-2">
              Content Management System
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nousart.gallery"
                  className="w-full pl-10 pr-4 py-3 bg-ink-900 border border-white/10 rounded-xl text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-ink-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-ink-900 border border-white/10 rounded-xl text-xs text-ink-100 placeholder-ink-400 focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold group flex items-center justify-center gap-2 py-3.5 text-xs rounded-xl font-bold shadow-lg"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In to Back Office'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] font-mono text-ink-400">
              Cloudflare R2 Storage & Client Synchronization Active
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
