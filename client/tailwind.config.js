/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    // Dynamic status colors that Tailwind might purge
    'border-t-verified-green', 'border-t-signal-amber', 'border-t-alert-red',
    'text-verified-green', 'text-signal-amber', 'text-alert-red',
    'bg-verified-green', 'bg-signal-amber', 'bg-alert-red',
    'border-alert-red', 'border-verified-green', 'border-signal-amber',
  ],
  theme: {
    extend: {
      colors: {
        // Core brand palette
        'road-navy': '#003470',
        'navy': '#1B4B8F',
        'royal-purple': '#6D28D9',
        'deep-indigo': '#312E81',
        'lavender-gray': '#F4F4FB',
        'signal-amber': '#F5A623',
        'alert-red': '#D93025',
        'verified-green': '#1E8E5A',
        'asphalt': '#1A1A1A',
        'fog': '#F7F8FA',
        'plate-white': '#FFFFFF',
        // Surface tokens
        'surface': '#fcf9f8',
        'surface-dim': '#dcd9d9',
        'surface-low': '#f6f3f2',
        'surface-mid': '#f0eded',
        'surface-high': '#eae7e7',
        'surface-highest': '#e5e2e1',
        'on-surface': '#1c1b1b',
        'on-surface-muted': '#434751',
        'outline': '#737782',
        'outline-light': '#c3c6d2',
      },
      fontFamily: {
        display: ['"IBM Plex Sans Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-mobile': ['26px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'data-mono': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '700' }],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      boxShadow: {
        'plate': '0 2px 8px rgba(26,26,26,0.12)',
        'card': '0 1px 4px rgba(26,26,26,0.06)',
        'float': '0 4px 12px rgba(26,26,26,0.10)',
        'sheet': '0 -4px 24px rgba(26,26,26,0.12)',
      },
      maxWidth: {
        'mobile': '420px',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-fast': 'spin 0.6s linear infinite',
      },
    },
  },
  plugins: [],
}
