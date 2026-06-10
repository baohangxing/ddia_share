/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        danger: '#ef4444',
        success: '#22c55e',
        surface: '#0a0a0a',
        'surface-light': '#111111',
        'surface-lighter': '#1a1a1a',
        text: '#f5f5f5',
        'text-muted': '#888888',
        border: '#2a2a2a',
      },
      fontFamily: {
        sans: ["'Noto Sans SC'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
        mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
      },
    },
  },
  plugins: [],
}
