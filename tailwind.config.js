/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        aurared: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      },
      boxShadow: {
        'phone': '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 12px #18181b, 0 0 0 14px #27272a',
      }
    },
  },
  plugins: [],
}
