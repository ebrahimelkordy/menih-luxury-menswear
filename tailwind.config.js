/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F5',
        sand: '#F5F0EB',
        cream: '#F0EAE1',
        espresso: {
          DEFAULT: '#1A1615',
          light: '#2E2826',
          soft: '#4A423D',
        },
        terracotta: {
          DEFAULT: '#C5A880', // Royal Gold
          light: '#E2D1B9',   // Light Gold
          dark: '#9E825A',    // Deep Bronze
        },
        olive: {
          DEFAULT: '#6A6B52',
          light: '#8A8B72',
          dark: '#525340',
        },
        rose: {
          dust: '#D4AFA6',
          muted: '#E8D5CE',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline': ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'subhead': ['clamp(1.125rem, 2vw, 1.5rem)', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '2rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'silk': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.25,1,0.5,1) forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.25,1,0.5,1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(10px, -8px) rotate(2deg)' },
          '66%': { transform: 'translate(-8px, 6px) rotate(-1deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
