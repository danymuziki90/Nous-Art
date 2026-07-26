/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070709', // Deep Obsidian Noir
          900: '#0e0e12', // Dark Charcoal
          850: '#131318', // Warm Midnight Slate
          800: '#1a1a21', // Dark Surface
          700: '#262630', // Surface Border/Hover
          600: '#383845',
          500: '#4e4e5e',
          400: '#757588',
          300: '#a2a2b3',
          200: '#cfcfdc',
          100: '#e7e7f0',
          50: '#f7f7fc',
        },
        gold: {
          900: '#4d3910',
          800: '#6e5218',
          700: '#8f6c20',
          600: '#b08729',
          500: '#d4af37', // Official Champagne Gold
          400: '#e2be4b',
          300: '#ebd16b',
          200: '#f3e39c',
          100: '#f9f3cf',
          50: '#fcfaf0',
        },
        champagne: '#f4e2b9',
        obsidian: '#0a0a0d',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        title: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.45em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'logo-glow': 'logoGlow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        logoGlow: {
          '0%': { filter: 'drop-shadow(0 0 2px rgba(212,175,55,0.2))' },
          '100%': { filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.6))' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4E2B9 0%, #D4AF37 50%, #AA8437 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #FFF0CC 0%, #E2BE4B 50%, #C59D33 100%)',
        'obsidian-radial': 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, rgba(7,7,9,0.98) 70%)',
      },
    },
  },
  plugins: [],
};
