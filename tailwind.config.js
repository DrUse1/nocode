// const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/script.js"],
  theme: {
    extend: {
      backgroundColor: {
        secondary: "rgb(243 244 246)",
      },
      textColor: {
        secondary: "hsl(240 3.8% 46.1%)",
      },
      borderColor: {
        input: "hsl(240 5.9% 90%)",
      },
      ringColor: {
        ring: "hsl(240 5% 64.9%)",
      },
      outlineColor: {
        secondary: "hsl(240 5% 64.9%)",
      },
    },
  },
  plugins: [],
};
