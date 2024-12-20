import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin"; // Import the `plugin` function


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
  plugins: [
    require('tailwind-scrollbar'),
    plugin(function ({ addUtilities  }) {
      addUtilities({
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
        },
        '.scrollbar-thumb-green-500': {
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#22c55e',
            borderRadius: '9999px',
          },
        },
        '.scrollbar-track-gray-800': {
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1f2937',
          },
        },
      });
    }),
  ],
} satisfies Config;
