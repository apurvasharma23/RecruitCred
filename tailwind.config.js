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
        background: '#0D101D',
        midnight: {
          950: '#0A0D18',
          900: '#111424',
          800: '#171A2B',
          700: '#1F243B',
          600: '#252A46',
          500: '#32395C',
        },
        surface: {
          50: '#F7F7F4',
          100: '#FFFFFF',
          200: '#E3E4EA',
          300: '#252A46',
          400: '#171A2B',
        },
        violet: {
          50: '#F2F1FF',
          100: '#E5E3FF',
          200: '#CECBFE',
          300: '#ADA7FE',
          400: '#8B7CFF',
          500: '#6C63FF',
          600: '#584DE8',
          700: '#483DC9',
          800: '#3A30A1',
          900: '#2E277D',
        },
        brand: {
          50: '#F2F1FF',
          100: '#E5E3FF',
          200: '#CECBFE',
          300: '#ADA7FE',
          400: '#8B7CFF',
          500: '#6C63FF',
          600: '#584DE8',
          700: '#483DC9',
          800: '#3A30A1',
          900: '#2E277D',
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
