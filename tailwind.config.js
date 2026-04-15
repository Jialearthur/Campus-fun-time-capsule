/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // Apple-style colors - Light Mode
        'apple-gray-50': '#F9F9F9',
        'apple-gray-100': '#F5F5F7',
        'apple-gray-200': '#E8E8ED',
        'apple-gray-300': '#D2D2D7',
        'apple-gray-400': '#86868B',
        'apple-gray-500': '#6E6E73',
        'apple-gray-600': '#424245',
        'apple-gray-700': '#1D1D1F',
        'apple-gray-800': '#0F0F11',
        'apple-gray-900': '#000000',
        
        'apple-blue': '#007AFF',
        'apple-blue-light': '#64B5F6',
        'apple-purple': '#AF52DE',
        'apple-purple-light': '#DDA0DD',
        'apple-pink': '#FF2D55',
        'apple-orange': '#FF9500',
        'apple-green': '#34C759',
        'apple-teal': '#5AC8FA',
        'apple-indigo': '#5856D6',
        
        // Dark Mode Colors
        'dark-bg-primary': '#0F0F11',
        'dark-bg-secondary': '#1D1D1F',
        'dark-bg-tertiary': '#2C2C2E',
        'dark-bg-elevated': '#3A3A3C',
        'dark-text-primary': '#F5F5F7',
        'dark-text-secondary': '#86868B',
        'dark-text-tertiary': '#6E6E73',
        'dark-border-primary': '#3A3A3C',
        'dark-border-secondary': '#48484A',
        'dark-accent-primary': '#0A84FF',
        'dark-accent-secondary': '#BF5AF2',
        'dark-accent-tertiary': '#FFD60A',
        
        // Legacy colors for compatibility
        'gummy-pink': '#FFD1DC',
        'gummy-purple': '#E6E6FA',
        'gummy-green': '#98FB98',
        'gummy-orange': '#FFB347',
        'gummy-blue': '#87CEEB',
        'gummy-cream': '#FFF8DC',
        'gummy-gray': '#F5F5F5',
        'gummy-dark': '#4A4A4A',
      },
      fontFamily: {
        'display': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'sans-serif'],
        'body': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI"', 'sans-serif'],
        'title': ['"ZCOOL QingKe HuangYou"', 'cursive'],
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
        'apple-2xl': '24px',
        'apple-3xl': '32px',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 16px 64px rgba(0, 0, 0, 0.16)',
        'apple-dark-sm': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'apple-dark': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'apple-dark-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'hover-lift': 'hoverLift 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
