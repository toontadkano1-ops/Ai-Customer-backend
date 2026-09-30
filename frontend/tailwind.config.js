/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        dark: {
          bg: '#0B0F17',
          surface: '#111827',
          card: '#161F30',
          border: '#1F293D',
          hover: '#243047'
        }
      },
      fontFamily: {
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.8125rem', { lineHeight: '1.2rem' }],   // ~13px
        'xs': ['0.9375rem', { lineHeight: '1.4rem' }],     // 15px (comfortable medium-compact)
        'sm': ['1.025rem', { lineHeight: '1.55rem' }],     // ~16.4px (standard readable body)
        'base': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px (prominent body)
        'lg': ['1.25rem', { lineHeight: '1.85rem' }],      // 20px
        'xl': ['1.45rem', { lineHeight: '2.05rem' }],      // 23px
        '2xl': ['1.75rem', { lineHeight: '2.3rem' }],      // 28px
        '3xl': ['2.25rem', { lineHeight: '2.65rem' }],     // 36px
        '4xl': ['2.75rem', { lineHeight: '3.15rem' }],     // 44px
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}
