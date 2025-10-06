/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        dark: {
          50: '#404040',
          100: '#333333',
          200: '#2a2a2a',
          300: '#222222',
          400: '#1a1a1a',
          500: '#141414',
          600: '#0f0f0f',
          700: '#0a0a0a',
          800: '#050505',
          900: '#000000',
        },
        neon: {
          red: '#ff0040',
          pink: '#ff006e',
          orange: '#ff4500',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-red': 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(220, 38, 38, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(239, 68, 68, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(127, 29, 29, 0.2) 0px, transparent 50%)',
        'gym-hero': "linear-gradient(rgba(0,0,0,0.7), rgba(220,38,38,0.3)), url('/images/gym-hero.jpg')",
      },
      animation: {
        'pulse-slow': 'pulse 2.75s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 1.75s infinite',
        'glow': 'glow 1.75s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 2.75s ease-in-out infinite',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'slide-left': 'slideLeft 0.25s ease-out',
        'slide-right': 'slideRight 0.25s ease-out',
        'fade-in': 'fadeIn 0.25s ease-out',
        'fade-in-up': 'fadeInUp 0.55s ease-out',
        'scale-in': 'scaleIn 0.1s ease-out',
        'shimmer': 'shimmer 1.75s linear infinite',
        'float': 'float 5.75s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 19.75s linear infinite',
        'tilt': 'tilt 9.75s infinite linear',
        'border-flow': 'borderFlow 2.75s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #dc2626, 0 0 10px #dc2626, 0 0 15px #dc2626' },
          '100%': { boxShadow: '0 0 10px #ef4444, 0 0 20px #ef4444, 0 0 30px #ef4444' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.4), 0 0 40px rgba(220, 38, 38, 0.2), inset 0 0 20px rgba(220, 38, 38, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3), inset 0 0 30px rgba(239, 68, 68, 0.2)'
          },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        borderFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(220, 38, 38, 0.5)',
        'glow': '0 0 20px rgba(220, 38, 38, 0.6)',
        'glow-lg': '0 0 30px rgba(220, 38, 38, 0.7)',
        'glow-xl': '0 0 40px rgba(220, 38, 38, 0.8), 0 0 80px rgba(220, 38, 38, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(220, 38, 38, 0.3)',
        'neon': '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500"), 0 0 40px theme("colors.primary.600")',
        'neon-lg': '0 0 10px theme("colors.primary.400"), 0 0 30px theme("colors.primary.500"), 0 0 60px theme("colors.primary.600"), 0 0 100px theme("colors.primary.700")',
        '3d': '0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 10px 40px -10px rgba(220, 38, 38, 0.2)',
        '3d-lg': '0 30px 80px -20px rgba(0, 0, 0, 0.4), 0 20px 60px -15px rgba(220, 38, 38, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.perspective-2000': {
          'perspective': '2000px',
        },
      });
    },
  ],
};
