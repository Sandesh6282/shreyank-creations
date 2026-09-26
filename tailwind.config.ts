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
        cream: {
          DEFAULT: "#FAF7F2",
          surface: "#FFFDF9",
          muted: "#F3EDE2",
        },
        terracotta: {
          DEFAULT: "#C85A32",
          hover: "#B34B26",
          dark: "#963B1D",
          light: "#F9EBE6",
        },
        espresso: {
          DEFAULT: "#2C1A14",
          light: "#422C24",
        },
        taupe: {
          DEFAULT: "#6E5D54",
          muted: "#94847B",
        },
        sage: {
          DEFAULT: "#4A6B5D",
          dark: "#3B564A",
          light: "#EBF0EC",
        },
        sand: {
          DEFAULT: "#E8DFC8",
          light: "#F5EFE3",
        },
      },
      fontFamily: {
        serif: ["Outfit", "var(--font-serif)", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        artisan: "0 4px 20px -2px rgba(44, 26, 20, 0.06)",
        card: "0 2px 12px -1px rgba(44, 26, 20, 0.04)",
        dropdown: "0 10px 30px -5px rgba(44, 26, 20, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
