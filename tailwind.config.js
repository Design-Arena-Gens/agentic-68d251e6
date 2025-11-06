/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#0f1729",
        aurora: {
          green: "#72f6c0",
          blue: "#5acaff",
          violet: "#b98bff"
        }
      }
    }
  },
  plugins: []
};
