import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // The design leans on subtle glass layers, so allow any 1% step for
      // slash-opacity utilities such as `bg-white/12` or `border-navy-100/45`.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
      colors: {
        navy: {
          50: '#F0F4FA',
          100: '#DDE6F3',
          200: '#B9CBE6',
          300: '#8AA9D3',
          400: '#4E7DB8',
          500: '#1B4F8A',
          600: '#143E6E',
          700: '#0F3059',
          800: '#0B2447',
          900: '#0A1A33',
          950: '#06101F',
        },
        orange: {
          50: '#FDF4EC',
          100: '#FAE4CF',
          200: '#F5C79E',
          300: '#EFA86B',
          400: '#EC9139',
          500: '#E87722',
          600: '#CE5E11',
          700: '#A7480D',
          800: '#84390F',
          900: '#6C300F',
        },
        surface: {
          DEFAULT: '#F0F4FA',
          2: '#E6EDF7',
          3: '#DCE5F2',
        },
        green: {
          brand: '#3E9B57',
          brandDark: '#2E7A43',
          brandLight: '#8FD6A4',
        },
      },
      fontFamily: {
        sans: ['var(--font-arabic)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-arabic)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* Display — section headline and hero title only. */
        'display-xl': ['clamp(2.25rem, 5.4vw, 4.5rem)', { lineHeight: '1.14', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(1.75rem, 3.4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.018em' }],
        'display-md': ['clamp(1.35rem, 2.2vw, 1.9rem)', { lineHeight: '1.28', letterSpacing: '-0.012em' }],
        'display-sm': ['clamp(1.1rem, 1.5vw, 1.35rem)', { lineHeight: '1.36', letterSpacing: '-0.008em' }],

        /* Numerals — deliberately tighter leading than type. */
        'stat-lg': ['clamp(2.125rem, 3vw, 2.625rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'stat-xl': ['clamp(3.5rem, 11vw, 7rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],

        /* Body — one rhythm, so paragraphs feel uniform everywhere. */
        'body-lg': ['1.0625rem', { lineHeight: '1.75', letterSpacing: '-0.005em' }],
        'body-md': ['1rem', { lineHeight: '1.72', letterSpacing: '-0.004em' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.7', letterSpacing: '-0.002em' }],
        'body-xs': ['0.875rem', { lineHeight: '1.65' }],

        /* Meta — labels, captions, counters. */
        'label-sm': ['0.75rem', { lineHeight: '1.45', letterSpacing: '0.01em' }],
        'label-xs': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label-2xs': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.03em' }],
      },
      spacing: {
        /* Consistent vertical rhythm between sections and blocks. */
        'section': 'var(--gap-section)',
      },
      maxWidth: {
        shell: 'var(--shell)',
        prose: '64ch',
        narrow: '46ch',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(232,119,34,0.28), 0 18px 60px -18px rgba(232,119,34,0.42)',
        card: '0 1px 2px rgba(10,26,51,0.04), 0 18px 40px -22px rgba(10,26,51,0.28)',
        'card-lg': '0 2px 4px rgba(10,26,51,0.05), 0 40px 80px -40px rgba(10,26,51,0.42)',
        header: '0 1px 0 rgba(255,255,255,0.08), 0 12px 40px -18px rgba(6,16,31,0.7)',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(27,79,138,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(27,79,138,0.07) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '56px 56px',
      },
      keyframes: {
        'dash-flow': {
          '0%': { strokeDashoffset: '260' },
          '100%': { strokeDashoffset: '0' },
        },
        'pulse-node': {
          '0%, 100%': { opacity: '0.28', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.5)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'marquee-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'dash-flow': 'dash-flow 3.2s linear infinite',
        'pulse-node': 'pulse-node 3s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        sheen: 'sheen 2.4s ease-in-out infinite',
        'marquee-x': 'marquee-x 38s linear infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;