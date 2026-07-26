import { Sparkles, Award, MapPin, Building2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const stats = [
    { n: '120+', l: 'Artistes Représentés', icon: Users },
    { n: '40', l: 'Expositions Organisées', icon: Award },
    { n: '1,200+', l: 'Œuvres Placées', icon: Building2 },
    { n: '11', l: 'Années d’Expertise', icon: MapPin },
  ];

  return (
    <div className="pt-32 pb-24 bg-ink-950 text-ink-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] uppercase tracking-widest font-semibold mb-6">
            <Sparkles size={12} />
            <span>Fondée à Paris en 2014</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ink-50 leading-[1.1] font-light text-balance">
            Une galerie bâtie sur la <span className="font-serif italic gold-text-gradient">conviction</span>, non sur la mode.
          </h1>
        </div>

        {/* Editorial Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-20 items-center">
          {/* Gallery Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Galerie Nous Art Paris"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            </div>

            {/* Badge overlay */}
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-lg border border-white/10 backdrop-blur-xl">
              <p className="font-display text-xl gold-text-gradient italic">
                "Chaque acquisition est le début d'une relation, non la fin d'une transaction."
              </p>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6 text-ink-200 leading-relaxed font-light text-base">
            <p className="text-lg text-ink-100 font-normal">
              La Galerie NOUS ART a été fondée en 2014 avec une certitude : l’art contemporain doit être une rencontre authentique et exigeante. Nous existons pour les collectionneurs qui achètent les yeux ouverts — pour les curieux, les passionnés et les esthètes.
            </p>
            <p>
              Depuis notre espace au cœur du premier arrondissement de Paris, nous présentons un programme d'expositions individuelles et collectives. Nous travaillons main dans la main avec des artistes dont les pratiques défient les classifications simples. Peinture, sculpture, vidéo et travaux sur papier dialoguent en toute liberté.
            </p>
            <p>
              Au-delà des murs de la galerie, nous conseillons les collections privées et institutionnelles dans le placement d’œuvres qui conservent leur profondeur à travers le temps.
            </p>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
              <Link to="/gallery" className="btn-gold rounded-sm">
                Découvrir nos Œuvres
              </Link>
              <Link to="/contact" className="btn-outline-gold rounded-sm">
                Prendre Rendez-vous
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-32 pt-16 pb-20 border-y border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.l} className="text-center space-y-3 glass-panel p-8 rounded-xl border border-white/5 hover:border-gold-500/30 transition-colors group">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                  <p className="font-display text-4xl sm:text-5xl font-semibold gold-text-gradient">{s.n}</p>
                  <p className="text-xs uppercase tracking-widest text-ink-300 font-sans">{s.l}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
