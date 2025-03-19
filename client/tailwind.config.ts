import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cardBackground: '#f0f9ff',
        primaryColor: '#31473A',
        secondaryColor: '#EDF4F2',
        customGreen: '#34AD54',
        customOrange: '#FF9933',
      },
    },
  },
  plugins: [],
} satisfies Config;
