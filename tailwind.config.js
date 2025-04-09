// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-dark": "#282828",
        "base-white": "rgba(255, 255, 255, 1)",
        "brand-500": "rgba(97, 114, 243, 1)",
        "gray-300": "rgba(208, 213, 221, 1)",
        "main-purple": "rgba(201, 179, 255, 1)",
        "mogador-green": "rgba(58, 77, 87, 1)",
      },
      padding: {
        "app-x": "300px",
        "app-y": "5rem", // py-20
      },
    },
  },
  plugins: [],
}