import { Sparkles, Award, MapPin, Building2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const stats = [
    { n: '120+', l: 'Artists Represented', icon: Users },
    { n: '40', l: 'Exhibitions Mounted', icon: Award },
    { n: '1,200+', l: 'Works Placed', icon: Building2 },
    { n: '11', l: 'Years of Curating', icon: MapPin },
  ];

  return (
    <div className="pt-32 pb-24 bg-ink-950 text-ink-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[10px] uppercase tracking-widest font-semibold mb-6">
            <Sparkles size={12} />
            <span>Founded in Paris • Est. 2014</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-ink-50 leading-[1.1] font-light text-balance">
            A gallery built on <span className="font-serif italic gold-text-gradient">conviction</span>, not trend.
          </h1>
        </div>

        {/* Editorial Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-20 items-center">
          {/* Gallery Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Nous Art Gallery Paris"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            </div>

            {/* Badge overlay */}
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-lg border border-white/10 backdrop-blur-xl">
              <p className="font-display text-xl gold-text-gradient italic">
                "Every acquisition is the beginning of a relationship, not the end of a transaction."
              </p>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6 text-ink-200 leading-relaxed font-light text-base">
            <p className="text-lg text-ink-100 font-normal">
              NOUS ART was founded in 2014 with a single conviction: that contemporary art should be encountered, not merely consumed. We exist for the collector who buys with their eyes open — for the patient, the curious, the deeply engaged.
            </p>
            <p>
              From our space in the first arrondissement of Paris, we present a programme of solo and group exhibitions, working closely with a roster of artists whose practices resist easy categorisation. Painting, sculpture, photography, and works on paper sit in dialogue with one another.
            </p>
            <p>
              Beyond the gallery walls, we advise private and corporate collections, placing works that hold their meaning over time.
            </p>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
              <Link to="/gallery" className="btn-gold rounded-sm">
                Explore Collection
              </Link>
              <Link to="/contact" className="btn-outline-gold rounded-sm">
                Schedule a Visit
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
