/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        slate: '#1f2937',
        mist: '#eef2f7',
        ocean: '#1e5b86',
        wave: '#2a74a8',
        mint: '#22c55e',
        sand: '#f8fafc',
      },
      fontFamily: {
        sans: ['"Sora"', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 16px 40px rgba(15, 23, 42, 0.12)',
        soft: '0 8px 20px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
