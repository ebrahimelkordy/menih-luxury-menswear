import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 12vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(3rem, 9vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 4vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Industrial palette
        concrete: {
          DEFAULT: '#E8E5DE',
          50: '#F5F3EF',
          100: '#EFEEE9',
          200: '#E8E5DE',
          300: '#D8D5CE',
          400: '#C0BDB4',
        },
        graphite: {
          DEFAULT: '#171717',
          700: '#1E1E1E',
          800: '#171717',
          900: '#0A0A0A',
        },
        steel: {
          light: '#B8B8B2',
          DEFAULT: '#777873',
          dark: '#4A4B47',
        },
        safety: {
          DEFAULT: '#E85B2A',
          light: '#F06A38',
          dark: '#C94A20',
        },
        chart: {
          '1': '12 76% 61%',
          '2': '173 58% 39%',
          '3': '197 37% 24%',
          '4': '43 74% 66%',
          '5': '27 87% 67%',
        },
      },
      borderWidth: {
        '2': '2px',
        '3': '3px',
      },
      letterSpacing: {
        'tightest': '-0.05em',
        'wider-2': '0.15em',
        'widest-2': '0.3em',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'line-extend': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'snap-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'line-extend': 'line-extend 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'snap-in': 'snap-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
