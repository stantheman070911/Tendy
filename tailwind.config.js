/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'harvest-gold': '#EAAA00',
        'evergreen': '#2E4034',
        'parchment': '#F9F8F5',
        'charcoal': '#333333',
        'stone': '#A3A3A3',
        'success': '#22c55e',
        'success-light': '#f0fdf4',
        'info': '#3b82f6',
        'info-light': '#eff6ff',
        'error': '#ef4444',
        'error-light': '#fef2f2',
      },
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: {
        'xs': '8px', 
        'sm': '16px', 
        'md': '24px', 
        'lg': '32px', 
        'xl': '48px', 
        '2xl': '64px', 
        '3xl': '96px', 
        '4xl': '128px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'counter': 'counter 2s cubic-bezier(0.4, 0, 0.2, 1)',
        'counter-bounce': 'counterBounce 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        counter: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px) scale(0.9)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'translateY(-2px) scale(1.02)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        counterBounce: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.8)' 
          },
          '60%': { 
            opacity: '1', 
            transform: 'translateY(-5px) scale(1.05)' 
          },
          '80%': { 
            transform: 'translateY(2px) scale(0.98)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
      },
      // Add specific breakpoints for counter responsiveness
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};