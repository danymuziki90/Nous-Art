import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you could send this to a monitoring service (Sentry, etc.)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink-950 text-ink-50 flex items-center justify-center p-6">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-md w-full text-center space-y-6 relative z-10">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-light text-ink-50">
                Une erreur est survenue
              </h1>
              <p className="text-sm text-ink-300 font-sans leading-relaxed">
                Un problème inattendu a interrompu cette page.
                Vos données sont préservées — rechargez ou retournez à l'accueil.
              </p>
            </div>

            {/* Error details (collapsed, for debugging) */}
            {this.state.error && (
              <details className="text-left">
                <summary className="text-xs text-ink-400 font-mono cursor-pointer hover:text-ink-200 transition-colors">
                  Détails techniques
                </summary>
                <pre className="mt-2 p-3 bg-ink-900 border border-white/10 rounded-lg text-[10px] text-red-300 font-mono overflow-auto max-h-32 text-left">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleHome}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-xs font-mono text-ink-200 hover:text-ink-50 hover:border-white/30 transition-all"
              >
                <Home size={14} />
                <span>Accueil</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs font-mono text-gold-300 hover:bg-gold-500/20 transition-all"
              >
                <RefreshCw size={14} />
                <span>Recharger</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
