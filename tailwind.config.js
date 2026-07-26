/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#09080a', // Dark Obsidian Base
          900: '#121114', 
          850: '#17151a',
          800: '#1f1d22', // Surface
          700: '#2c2930', 
          600: '#3e3a45',
          500: '#544f5e',
          400: '#7e788a',
          300: '#ada7b8',
          200: '#d7d3e0',
          100: '#ece9f2',
          50: '#f8f7fa',
        },
        gold: {
          900: '#4a3a22',
          800: '#6b5431',
          700: '#8c6e40',
          600: '#ab874e',
          500: '#d4ad76', // Primary Logo Gold
          400: '#e5be88',
          300: '#f0cf9e',
          200: '#f9e0b8',
          100: '#fce9c1', // Bright Logo Highlight
          50: '#fef7e8',
        },
        champagne: '#fce9c1',
        obsidian: '#09080a',
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
        'marquee': 'marquee 40s linear infinite',
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
          '0%': { filter: 'drop-shadow(0 0 2px rgba(212,173,118,0.2))' },
          '100%': { filter: 'drop-shadow(0 0 10px rgba(212,173,118,0.6))' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fce9c1 0%, #d4ad76 50%, #c69e6a 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #fff3d8 0%, #e5be88 50%, #d4ad76 100%)',
        'obsidian-radial': 'radial-gradient(circle at 50% 0%, rgba(212,173,118,0.08) 0%, rgba(9,8,10,0.98) 70%)',
      },
    },
  },
  plugins: [],
};
