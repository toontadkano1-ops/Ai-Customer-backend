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
        display: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.95rem' }], // ~10.5px
        'xs': ['0.75rem', { lineHeight: '1.05rem' }],     // 12px
        'sm': ['0.8125rem', { lineHeight: '1.2rem' }],   // 13px
        'base': ['0.875rem', { lineHeight: '1.35rem' }],  // 14px (balanced medium)
        'md': ['0.9375rem', { lineHeight: '1.45rem' }],   // 15px
        'lg': ['1rem', { lineHeight: '1.5rem' }],        // 16px
        'xl': ['1.125rem', { lineHeight: '1.65rem' }],    // 18px
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '3xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px (balanced medium headline)
        '4xl': ['1.75rem', { lineHeight: '2.25rem' }],    // 28px (balanced hero title)
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
