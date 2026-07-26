import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface MediumShowcase {
  id: string;
  title: string;
  medium: string;
  count: string;
  tagline: string;
  image: string;
  featuredArtist: string;
  icon: LucideIcon;
}

interface MediumCardProps {
  medium: MediumShowcase;
  className?: string;
  index: number;
}

export function MediumCard({ medium, className = "", index }: MediumCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = medium.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`perspective-[1500px] group ${className}`}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer shadow-2xl bg-ink-900 border border-white/5"
      >
        {/* Dynamic Glare Overlay */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)",
            left: glareX,
            top: glareY,
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%"
          }}
        />

        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-ink-950">
          <img
            src={medium.image}
            alt={medium.title}
            className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] transition-transform duration-[1.5s] ease-out group-hover:scale-110 group-hover:brightness-[0.4]"
          />
          {/* Subtle gradient so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        </div>

        {/* Default State Content (Always visible, pushes to background on hover) */}
        <motion.div 
          style={{ translateZ: "20px" }}
          className="absolute inset-0 z-10 flex flex-col justify-end p-6 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-4 pointer-events-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink-950/80 border border-white/10 flex items-center justify-center text-ink-200 backdrop-blur-md">
              <Icon size={18} />
            </div>
            <h3 className="font-display text-2xl text-ink-50 font-light drop-shadow-md">
              {medium.title}
            </h3>
          </div>
        </motion.div>

        {/* Hover State Content (Reveals on hover) */}
        <motion.div 
          style={{ translateZ: "40px" }}
          className="absolute inset-0 z-10 flex flex-col justify-between p-6 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1] bg-ink-950/40 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start">
            <div className="glass-panel-gold px-3 py-1.5 rounded-full border border-gold-500/30 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-gold-300 font-mono">
                {medium.count}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-ink-950 shadow-lg shadow-gold-500/20 pointer-events-none">
              <Icon size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-3xl sm:text-4xl text-ink-50 font-light drop-shadow-md">
              {medium.title}
            </h3>
            <p className="text-sm text-ink-100 max-w-sm font-light leading-relaxed">
              {medium.tagline}
            </p>
            <p className="text-[11px] text-ink-300 uppercase tracking-widest font-mono">
              Featured: {medium.featuredArtist}
            </p>

            <div className="pt-2">
              <Link
                to={`/gallery?medium=${medium.medium}`}
                className="btn-gold rounded-full group/btn inline-flex items-center gap-3 !py-2.5 !px-5 text-[11px] uppercase font-semibold shadow-xl"
              >
                <span>Explore Works</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
