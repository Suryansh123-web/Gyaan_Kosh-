/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-slow': 'glow 8s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)', filter: 'blur(40px)', opacity: 0.3 },
          '33%': { transform: 'scale(1.1) translate(30px, -50px)', filter: 'blur(60px)', opacity: 0.5 },
          '66%': { transform: 'scale(0.9) translate(-20px, 20px)', filter: 'blur(50px)', opacity: 0.4 },
        }
      }
    },
  },
  plugins: [],
}
