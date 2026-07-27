import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import {
  Sparkles,
  Award,
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  Compass,
  ArrowRight,
  ChevronDown,
  Quote,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { SEO } from '@/components/SEO';

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const PILLARS = [
  {
    id: 'provenance',
    title: 'Uncompromising Provenance',
    icon: ShieldCheck,
    tagline: 'Museum-grade authentication and direct artist studio origin.',
    description:
      'Every artwork at NOUS ART is accompanied by a blockchain-registered Certificate of Authenticity and an exhaustive record of exhibition history and provenance.',
  },
  {
    id: 'spatial',
    title: 'Spatial Harmony',
    icon: Building2,
    tagline: 'Architectural integration between light, room, and form.',
    description:
      'We curate works that interact with interior volume and natural light, transforming private residences and public institutions into serene spatial experiences.',
  },
  {
    id: 'roster',
    title: 'Global Master Roster',
    icon: Users,
    tagline: 'Representing mid-career and museum-collected visionaries.',
    description:
      'Our artists are represented in permanent collections across Paris, Milan, Tokyo, and New York, pushing the boundaries of abstraction and physical medium.',
  },
  {
    id: 'alliances',
    title: 'Museum & Institutional Alliances',
    icon: Award,
    tagline: 'Facilitating loans and monographic surveys worldwide.',
    description:
      'NOUS ART collaborates with international biennials, contemporary foundations, and private trusts to publish scholarly catalogs and organize museum loans.',
  },
];

const STATS = [
  { n: '12+', l: 'Years of Curation', icon: Calendar, sub: 'Established in 2014' },
  { n: '1,500+', l: 'Placed Artworks', icon: Building2, sub: 'In Private & Public Collections' },
  { n: '45+', l: 'Exhibitions Mounted', icon: Award, sub: 'Solo & Monographic Surveys' },
  { n: '18', l: 'Represented Masters', icon: Users, sub: 'Global Contemporary Talent' },
];

export default function About() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <>
      <SEO
        title="About & Curatorial Philosophy — NOUS ART Gallery"
        description="Discover the history, spatial philosophy, and curatorial vision of NOUS ART Gallery."
        url="/about"
      />

      <div ref={targetRef} className="bg-ink-950 text-ink-50 min-h-screen pt-28 pb-24 overflow-hidden relative">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute top-3/4 left-1/4 w-[450px] h-[450px] bg-gold-600/5 blur-[160px] rounded-full pointer-events-none" />

        {/* --- SECTION 1: CINEMATIC HERO BANNER --- */}
        <section className="container mx-auto px-6 lg:px-12 relative z-10 pt-8 pb-20">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="max-w-4xl space-y-6"
          >
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-mono uppercase tracking-widest shadow-md">
              <Sparkles size={14} />
              <span>Established 2014 • Milan • Paris • Fort Worth</span>
            </motion.div>

            <motion.h1
              variants={FADE_UP}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-light text-ink-50 tracking-tight leading-[1.1]"
            >
              A Gallery Built on <br />
              <span className="font-serif italic gold-text-gradient font-normal">Conviction</span> & Spatial Stillness.
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              className="font-serif text-lg sm:text-xl md:text-2xl text-ink-200 font-light leading-relaxed max-w-3xl"
            >
              NOUS ART bridges museum-represented masters and avant-garde contemporary talent through rigorous curation, architectural spatial harmony, and authentic provenance.
            </motion.p>
          </motion.div>

          {/* Parallax Hero Image Banner */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="mt-16 relative aspect-[21/9] sm:aspect-[24/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-ink-900 group"
          >
            <img
              src="https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=2000"
              alt="NOUS ART Main Atrium Gallery"
              className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05] transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border border-white/15 backdrop-blur-xl">
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-2">
                Main Exhibition Hall • Hall A
              </span>
              <p className="font-serif text-lg text-ink-100 italic leading-snug">
                "Art should not be merely displayed; it must alter the atmosphere of the room in which it lives."
              </p>
            </div>
          </motion.div>
        </section>

        {/* --- SECTION 2: CURATORIAL PHILOSOPHY & MANIFESTO --- */}
        <section className="container mx-auto px-6 lg:px-12 py-20 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image & Floating Quote */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-ink-900 group">
                <img
                  src="https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Curator inspecting canvas"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
              </div>

              {/* Floating Glass Quote Card */}
              <div className="absolute -bottom-8 -right-4 sm:bottom-8 sm:-right-8 max-w-sm glass-panel p-6 rounded-2xl border border-gold-500/30 backdrop-blur-2xl shadow-2xl space-y-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Quote size={16} />
                </div>
                <p className="font-serif text-sm text-ink-100 italic leading-relaxed">
                  "Every acquisition is the beginning of a lifelong dialogue, not the end of a commercial transaction."
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gold-400">
                  <span>Isabella Vance</span>
                  <span>Founder & Chief Advisor</span>
                </div>
              </div>
            </motion.div>

            {/* Right Editorial Text & Manifesto */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-8"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-2">
                  Our Curatorial Manifesto
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ink-50 leading-tight">
                  Discerning Art for <br />
                  <span className="font-serif italic gold-text-gradient font-normal">Thoughtful Collectors</span>
                </h2>
              </div>

              <div className="space-y-5 text-ink-200 font-light text-base leading-relaxed font-sans">
                <p>
                  NOUS ART was established in 2014 with a singular commitment: to present contemporary works that possess timeless intellectual weight, physical tactile richness, and undeniable artistic integrity.
                </p>
                <p>
                  We operate beyond transient market trends. Our gallery roster features painters, sculptors, and fine-art photographers who explore mineral pigments, atmospheric light, brutalist architecture, and spatial stillness.
                </p>
                <p>
                  Whether working with seasoned museum trustees or first-time collectors, our advisory team provides complete guidance on physical acquisition, archival framing, lighting design, and collection management.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <Link to="/gallery" className="btn-gold group flex items-center gap-2 py-3 px-6 text-xs rounded-xl font-bold shadow-lg">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-gold-outline py-3 px-6 text-xs rounded-xl">
                  Schedule Private Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- SECTION 3: THE 4 CURATORIAL PILLARS --- */}
        <section className="container mx-auto px-6 lg:px-12 py-20 border-t border-white/10 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
              Core Principles
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-ink-50 font-light">
              The Four Pillars of <span className="font-serif italic gold-text-gradient">NOUS ART</span>
            </h2>
            <p className="font-sans text-sm text-ink-300 font-light">
              Our operational standards that govern every exhibition, loan, and private placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-gold-500/40 transition-all group flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                      <IconComp size={22} />
                    </div>
                    <h3 className="font-display text-xl text-ink-50 font-medium group-hover:text-gold-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono text-gold-400/90 leading-tight">
                      {pillar.tagline}
                    </p>
                    <p className="text-xs text-ink-300 font-sans font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 text-[10px] font-mono text-ink-400 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>NOUS Standard Verified</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- SECTION 4: GLOBAL MILESTONE STATS --- */}
        <section className="container mx-auto px-6 lg:px-12 py-16 border-t border-white/10 relative z-10">
          <div className="glass-panel p-10 md:p-14 rounded-3xl border border-white/10 bg-gradient-to-b from-ink-900/80 to-ink-950 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.l}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="text-center space-y-3 pt-6 md:pt-0 md:px-4 group"
                  >
                    <div className="w-10 h-10 mx-auto rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                    <p className="font-display text-4xl sm:text-5xl font-light gold-text-gradient tracking-tight">
                      {stat.n}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-widest text-ink-100 font-semibold">
                      {stat.l}
                    </p>
                    <p className="text-[10px] font-mono text-ink-400">{stat.sub}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- SECTION 5: GALLERY ARCHITECTURE & VISITATION --- */}
        <section className="container mx-auto px-6 lg:px-12 py-20 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block">
                The Space & Architecture
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-ink-50 font-light leading-tight">
                Designed for Quiet <br />
                <span className="font-serif italic gold-text-gradient">Contemplation</span>
              </h2>
              <p className="text-sm text-ink-200 font-light leading-relaxed font-sans">
                Our main gallery spans over 850 square meters of minimalist architectural volume. Featuring museum-grade DALI directional lighting and climate-controlled environment, the space allows monumental canvases and sculptures to breathe in pure natural light.
              </p>

              <div className="space-y-3 font-mono text-xs text-ink-300 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <MapPin size={16} className="text-gold-400 shrink-0" />
                  <span>Main Gallery • 2719 Tropical Point, Fort Worth, TX, USA</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Calendar size={16} className="text-gold-400 shrink-0" />
                  <span>Visiting Hours: Tuesday – Saturday: 11:00 AM – 7:00 PM</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/exhibitions" className="btn-gold-outline inline-flex items-center gap-2 py-3 px-6 text-xs rounded-xl">
                  <span>View Current Exhibitions Programme</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-ink-900 group">
                  <img
                    src="https://images.pexels.com/photos/2901935/pexels-photo-2901935.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Gallery Interior Atrium"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-900 group">
                  <img
                    src="https://images.pexels.com/photos/102127/pexels-photo-102127.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Sculpture Pavilion"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-900 group">
                  <img
                    src="https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Private Salon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-ink-900 group">
                  <img
                    src="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fine Art Archives"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 6: CALL TO ACTION --- */}
        <section className="container mx-auto px-6 lg:px-12 py-20 border-t border-white/10 relative z-10">
          <div className="glass-panel p-10 sm:p-16 rounded-3xl border border-gold-500/30 text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto shadow-md">
              <Sparkles size={22} />
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-light text-ink-50">
              Begin Your <span className="font-serif italic gold-text-gradient">Collection Journey</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-ink-200 font-light leading-relaxed max-w-xl mx-auto">
              Explore our online marketplace, schedule a private viewing at our main gallery space, or speak directly with our curatorial advisory team.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link to="/gallery" className="btn-gold group flex items-center gap-2 py-3.5 px-8 text-xs rounded-xl font-bold shadow-xl">
                <span>Browse Full Marketplace</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="btn-gold-outline py-3.5 px-8 text-xs rounded-xl font-mono">
                Contact Advisory Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
