export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        accent: '#06B6D4',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        dark: '#0A0A0F',
        surface: '#111118',
        card: '#16161F',
        border: '#1E1E2E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
