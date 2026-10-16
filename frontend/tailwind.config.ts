import type { Config } from 'tailwindcss';

/**
 * Halden design system — quiet premium homewares.
 * One warm accent (#8A5A44 clay) + a neutral sand/ink palette. No gradients.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F5',      // page background (warm white)
        sand: {                // secondary neutral surfaces
          DEFAULT: '#EDE4D8',
          deep: '#E2D6C4',
          soft: '#F3EDE4',
        },
        ink: {                // text
          DEFAULT: '#1A1714',
          soft: '#5B534A',
          faint: '#8C8378',
        },
        line: '#E1D8CB',       // hairline borders
        clay: {               // the single accent
          DEFAULT: '#8A5A44',
          dark: '#6E4634',
          light: '#A87560',
        },
        success: '#3E6B4F',
        danger: '#9B3B32',
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['4.5rem', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        h1: ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        h2: ['2.25rem', { lineHeight: '1.1' }],
        h3: ['1.5rem', { lineHeight: '1.2' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      maxWidth: {
        shell: '84rem',
        prose: '42rem',
      },
      spacing: {
        section: '7.5rem',
      },
      borderRadius: {
        card: '2px',
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,23,20,0.04)',
        lift: '0 12px 30px -18px rgba(26,23,20,0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
