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
        green: "#009963",
        beige: "#F5F0E5",
        searchBeige: "#A1824A",
        productNameColor: "#1C170D",
        hoverColor: "#FFCF65",
        greenText: '#4F966E',
        greenComponent: '#009963',
        newgreen:'#47663B',
        newgreensecond: '#1F4529',
        cream: '#E8ECD7',
        newbeige: "#EED3B1",
        lightgreen: '#70BD84'

      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
