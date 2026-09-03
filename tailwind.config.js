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
        palace: {
          950: '#050E0B',
          900: '#081711',
          850: '#0B1E17',
          800: '#0E271E',
          700: '#15382B',
          600: '#1E4D3B',
        },
        emerald: {
          400: '#48C79B',
          500: '#28A77B',
          600: '#1E7B5C',
          700: '#145A42',
        },
        gold: {
          300: '#F5E2B3',
          400: '#E6CA85',
          500: '#D4AF37',
          600: '#B38E2A',
        },
        husk: {
          400: '#D97706',
          500: '#B45309',
          600: '#92400E',
        }
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
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
