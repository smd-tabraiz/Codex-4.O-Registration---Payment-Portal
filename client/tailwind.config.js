/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        navy: {
          800: '#1E293B',
          900: '#0F172A',
        },
        surface: '#FFFFFF',
        main: '#F8FAFC',
        sub: '#F1F5F9',
      },
      boxShadow: {
        card: '0 4px 12px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 8px 20px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
};
