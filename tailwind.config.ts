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
        primary: {
          DEFAULT: "#154212",
          container: "#2d5a27",
        },
        secondary: {
          DEFAULT: "#984721",
          container: "#fd966a",
        },
        surface: {
          DEFAULT: "#fbf9f8",
          dim: "#dbd9d9",
        },
        cream: "#fbf9f8",
        forest: "#154212",
        terracotta: "#984721",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "sans-serif"],
        heading: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
