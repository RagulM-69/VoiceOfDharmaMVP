import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'krishna-blue': '#0A1F44',
        'gold': '#C8960C',
        'saffron': '#F5A623',
        'cream': '#FDF6EC',
        'text-dark': '#1A1A1A',
        'text-muted': '#6B7280',
        'error': '#DC2626',
        'success': '#16A34A',
      },
      fontFamily: {
        garamond: ['var(--font-garamond)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
