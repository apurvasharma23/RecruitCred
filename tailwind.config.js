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
        background: '#0B1517',
        midnight: {
          950: '#081012',
          900: '#102022',
          800: '#162A2B',
          700: '#203A3B',
          600: '#2A4848',
          500: '#3A5B59',
        },
        surface: {
          50: '#F7F7F4',
          100: '#FFFFFF',
          200: '#E3E4EA',
          300: '#252A46',
          400: '#171A2B',
        },
        violet: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        brand: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        neutralText: {
          primary: '#171A2B',
          secondary: '#666A7A',
          border: '#E3E4EA',
        },
        status: {
          claimed: '#666A7A',
          evidence: '#6C63FF',
          assessed: '#8B7CFF',
          verified: '#10B981',
        },
        verified: {
          light: '#ECFDF5',
          border: '#059669',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        pending: {
          light: '#FFFBEB',
          border: '#D97706',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        claimed: {
          light: '#F8FAFC',
          border: '#64748B',
          DEFAULT: '#666A7A',
          dark: '#475569',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.35)',
        'popover': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
        'verified-badge': '0 1px 2px 0 rgba(16, 185, 129, 0.2)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
