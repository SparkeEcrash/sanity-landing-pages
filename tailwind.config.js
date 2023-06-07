const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity-components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      // smallest for support should be 320px
      xsm: "475px",
      // => @media (min-width: 475px) *custom added*
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
      "3xl": "1900px",
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", ...fontFamily.serif],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "royal-blue": "#153084",
        "blue-green": "#99D9EA",
        "blue-grotto": "#189AB4",
        "baby-blue": "#D4F1F4",
        "border-grey": "#D3D3D3",
        "background-black": "#2e2e30",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
