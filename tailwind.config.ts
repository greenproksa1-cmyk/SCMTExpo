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
          100: '#E0E7F0',
          200: '#C1C9DE',
          300: '#A2A9C4',
          400: '#6E76A0',
          500: '#3F4F6B',
          600: '#2D3751',
          700: '#1F2E4D',
          800: '#16213A',
          900: '#0D1420',
          950: '#060B12',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FFF8EB',
          200: '#FFF0D9',
          300: '#FFE8C9',
          400: '#FFE0BB',
          500: '#FFD7A8',
          600: '#E0B93A',
          700: '#C9A227',
          800: '#B28A1F',
          900: '#9A7218',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          2: '#F0F4FA',
          3: '#E6EDF7',
          subtle: 'rgba(255, 255, 255, 0.06)',
        },
        accent: {
          gold: '#E0B93A',
          goldLight: '#F5E1A9',
          goldGradient: 'linear-gradient(135deg, #E0B93A, #C9A227)',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        sans: ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /*
         * Display — section headline and hero title only.
         *
         * Capped at 3.375rem: the Arabic title runs to three lines, and at 4.5rem
         * it swallowed the whole first screen. Letter-spacing is deliberately
         * mild here; globals.css neutralises it to 0 for Arabic, where negative
         * tracking breaks the joins between letters.
         */
        'display-xl': ['clamp(2rem, 3.9vw, 3.375rem)', { lineHeight: '1.24', letterSpacing: '-0.012em' }],
        'display-lg': ['clamp(1.625rem, 2.9vw, 2.5rem)', { lineHeight: '1.26', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.3rem, 1.9vw, 1.625rem)', { lineHeight: '1.32', letterSpacing: '-0.006em' }],
        'display-sm': ['clamp(1.075rem, 1.3vw, 1.25rem)', { lineHeight: '1.4', letterSpacing: '-0.004em' }],

        /* Numerals — deliberately tighter leading than type. */
        'stat-lg': ['clamp(2.125rem, 3vw, 2.625rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'stat-xl': ['clamp(3.5rem, 11vw, 7rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],

        /*
         * Countdown digits. Sized from the component's own container, never the
         * viewport: the same countdown is used in the hero and in a narrow card,
         * so it must stay legible in both without ever overflowing.
         */
        countdown: ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],

        /* Body — one rhythm, so paragraphs feel uniform everywhere. */
        'body-lg': ['1.0625rem', { lineHeight: '1.75', letterSpacing: '-0.005em' }],
        'body-md': ['1rem', { lineHeight: '1.72', letterSpacing: '-0.004em' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.7', letterSpacing: '-0.002em' }],
        'body-xs': ['0.875rem', { lineHeight: '1.65' }],

        /*
         * Meta — labels, captions, counters.
         *
         * Fluid rather than fixed: these were pinned at 10–11px, which is below
         * what a phone can render comfortably and left ~150 nodes on the page
         * under 12px. The floor is now 11px and the ceiling 12–14px, so a phone
         * gets readable labels and a desktop still gets the tight caption look.
         */
        'label-sm': ['clamp(0.8125rem, 1.7vw, 0.875rem)', { lineHeight: '1.45', letterSpacing: '0.01em' }],
        'label-xs': ['clamp(0.75rem, 1.5vw, 0.8125rem)', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label-2xs': ['clamp(0.75rem, 1.25vw, 0.8125rem)', { lineHeight: '1.4', letterSpacing: '0.03em' }],

        /*
         * The desktop header nav.
         *
         * Seven labels have to share one fixed-width bar: the shell caps at
         * 82rem, so past 1312px of viewport there is no more room to win and a
         * fluid size would only shrink needlessly on a wide screen. The measured
         * one-line cost is 759px in Arabic and 988px in English at the old 14px
         * `body-xs`, against a 1200px budget that also has to hold the wordmark
         * and the booking button — English simply did not fit, and every label
         * silently wrapped to two lines.
         *
         * 12px is the floor the label scale already sits at (`label-xs` and
         * `label-2xs` both bottom out there), so this stays inside the type
         * system rather than inventing a new tier. Below this the wordmark
         * starts losing lines and the trade stops being worth making: at 12px
         * English still gets 198px, enough for three lines; squeezing the nav
         * further would buy the logo a fourth line of height it cannot use.
         *
         * Letter spacing is zero on purpose — any tracking on Arabic breaks
         * the joins between letters.
         */
        'label-nav': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0' }],
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