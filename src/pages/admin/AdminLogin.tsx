import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AdminLogin() {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
    // If successful, onAuthStateChange in AuthProvider updates context.
    // The component will re-render and navigate automatically via the condition above.
  };

  return (
    <div className="min-h-screen bg-ink-950 text-ink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md fade-up">
        {/* Logo Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3.5 mb-6 group">
            <div className="w-12 h-12 rounded-xl bg-ink-900 border border-gold-500/40 flex items-center justify-center shadow-lg group-hover:border-gold-500 transition-colors overflow-hidden">
              <img src="/img/logo.jpeg" alt="Nous Art Logo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </Link>
          
          <h1 className="font-display text-4xl text-ink-50 font-light">
            Admin <span className="font-serif italic gold-text-gradient">Portal</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-ink-300 mt-2 font-mono">
            NOUS ART Gallery
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-gold-400 border-b border-white/10 pb-4">
            <Lock size={18} />
            <span className="text-xs uppercase tracking-widest font-semibold">Secure Authentication</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-ink-200 mb-2 font-medium">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="admin@nousart.gallery"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink-900/80 border border-white/10 rounded-md px-4 py-3.5 text-ink-50 placeholder-ink-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-ink-200 mb-2 font-medium">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink-900/80 border border-white/10 rounded-md px-4 py-3.5 text-ink-50 placeholder-ink-300 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md p-3.5">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold rounded-md w-full group flex items-center justify-center gap-3 !py-4 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              {!submitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-xs text-ink-300 hover:text-gold-300 transition-colors uppercase tracking-widest">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
