// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import tailwindRtl from "tailwindcss-rtl";
import forms from "@tailwindcss/forms";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        readex: ['"Readex Pro"', "sans-serif"],
      },
    },
  },
  plugins: [tailwindRtl, forms],
};
