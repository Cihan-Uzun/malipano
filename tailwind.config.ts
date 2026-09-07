import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f2744",
          50: "#e8eef5",
          100: "#c5d4e6",
          200: "#9bb4d1",
          300: "#7194bc",
          400: "#4d74a3",
          500: "#2a548a",
          600: "#1a3d6b",
          700: "#0f2744",
          800: "#0a1b30",
          900: "#05101c",
        },
        teal: {
          DEFAULT: "#0d9488",
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
