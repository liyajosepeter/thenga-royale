/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // Multi-tier Dark Green Glassmorphism Palette
        forest: {
          950: '#04100B',
          900: '#071812',
          850: '#0A2018',
          800: '#0E291F',
          700: '#14382B',
        },
        emerald: {
          950: '#061C14',
          900: '#0A261D',
          800: '#0E3327',
          700: '#134434',
          600: '#1B5C47',
          500: '#288B6B',
          400: '#38B289',
          300: '#58C9A3',
          200: '#8AE0C2',
          100: '#C2F0DE',
          50: '#E3FAF0',
        },
        sage: {
          400: '#7EAE9B',
          300: '#9EC3B4',
          200: '#C1DDD2',
          100: '#E5F2EC',
        },
        mint: {
          400: '#2EC4B6',
          300: '#64DFDF',
          200: '#A0E8E1',
          100: '#DDF7ED',
        },
        
        // Supporting Luxury Warm Ivory & Off-White
        ivory: {
          50: '#FDFCF9',
          100: '#FBF9F4',
          200: '#F5F2EA',
          300: '#EDE8DD',
          400: '#DFD8C8',
        },
        
        // Premium Champagne Gold Accents
        gold: {
          100: '#FDF9E8',
          200: '#FAF0C5',
          300: '#F5E2B3',
          400: '#E6CA85',
          500: '#D4AF37',
          600: '#B38E2A',
          700: '#8C6C1B',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        malayalam: ['var(--font-malayalam)', 'Gayathri', 'Anek Malayalam', 'Manjari', 'sans-serif'],
        'malayalam-serif': ['var(--font-malayalam-serif)', 'Noto Serif Malayalam', 'Gayathri', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'floatGentle 5s ease-in-out infinite',
        'crown-float': 'crownFloat 4s ease-in-out infinite',
        'laser-scan': 'laserScan 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        crownFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        laserScan: {
          '0%': { top: '5%', opacity: '0.8' },
          '50%': { top: '85%', opacity: '1' },
          '100%': { top: '5%', opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
