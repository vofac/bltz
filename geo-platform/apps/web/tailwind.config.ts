import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EAF6F7",
          100: "#D2ECEE",
          300: "#7FC9CE",
          500: "#0E7C86",
          600: "#0B646C",
          700: "#094F55",
          900: "#063338",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "'PingFang SC'",
          "'Microsoft YaHei'",
          "Roboto",
          "sans-serif",
        ],
        mono: ["'SFMono-Regular'", "Consolas", "'Liberation Mono'", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
