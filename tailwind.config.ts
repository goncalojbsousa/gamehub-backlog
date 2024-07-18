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
        background: "var(--background)",
        color_main: "var(--color_main)",
        color_sec: "var(--color_sec)",
        color_text: "var(--color_text)",
        color_icons: "var(--color_icons)",
        btn_logout: "var(--btn_logout)",
        border_detail: "var(--border_detail)",
      }
    },
  },
  darkMode: 'class',
  plugins: [],
};
export default config;
