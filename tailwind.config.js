/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- ¡Asegúrate que esta línea esté perfecta!
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', 
        secondary: '#f59e0b',
        danger: '#dc2626',
        success: '#16a34a',
        dark: '#1e293b',
      }
    },
  },
  plugins: [],
}