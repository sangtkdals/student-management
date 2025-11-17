/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#005A9C",
        "brand-blue-dark": "#004A8C",
        "brand-gray": "#E5E7EB",
        "brand-gray-light": "#F3F4F6",
        "brand-gray-dark": "#4B5563",
      },
    },
  },
  plugins: [],
};
