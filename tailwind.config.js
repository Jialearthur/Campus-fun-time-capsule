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
        'gummy-pink': '#FFD1DC',
        'gummy-purple': '#E6E6FA',
        'gummy-green': '#98FB98',
        'gummy-orange': '#FFB347',
        'gummy-blue': '#87CEEB',
        'gummy-cream': '#FFF8DC',
        'gummy-gray': '#F5F5F5',
        'gummy-dark': '#4A4A4A',
        'candy-pink': '#FF6B9D',
        'candy-purple': '#C06C84',
        'candy-yellow': '#FFD93D',
        'candy-orange': '#FF9A8B',
        'candy-green': '#6BCB77',
        'candy-teal': '#4ECDC4',
      },
      fontFamily: {
        'title': ['"ZCOOL QingKe HuangYou"', 'cursive'],
        'body': ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce-up': 'bounceUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '60%': { transform: 'translateY(-5px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'gummy': '0 8px 20px rgba(255, 209, 220, 0.3)',
        'gummy-hover': '0 12px 28px rgba(255, 209, 220, 0.4)',
      },
    },
  },
  plugins: [],
};
