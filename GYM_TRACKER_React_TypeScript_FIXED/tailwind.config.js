/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','sans-serif'] },
    colors: {
      background: 'rgb(var(--bg) / <alpha-value>)',
      surface: 'rgb(var(--surface) / <alpha-value>)',
      raised: 'rgb(var(--raised) / <alpha-value>)',
      line: 'rgb(var(--line) / <alpha-value>)',
      muted: 'rgb(var(--muted) / <alpha-value>)',
      foreground: 'rgb(var(--fg) / <alpha-value>)',
      accent: '#4385ff', success: '#43d995',
    },
    boxShadow: { glow: '0 8px 42px -13px rgba(67,133,255,.38)', panel: '0 6px 28px rgba(0,0,0,.09)' },
    keyframes: { fadeIn: { '0%': { opacity: '0', transform:'translateY(8px)' }, '100%': {opacity:'1',transform:'translateY(0)'} }, pulseSoft: { '50%': {opacity:'.6'} } },
    animation: { enter: 'fadeIn .32s ease-out both', 'pulse-soft': 'pulseSoft 2s ease-in-out infinite' },
  } },
  plugins: []
};
