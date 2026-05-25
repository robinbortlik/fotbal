/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0E8A4F",
        pitchDeep: "#084d2c",
        pitchDark: "#053b21",
        orange: "#F2A007",
        orangeDeep: "#d18800",
        navy: "#0B1F33",
        navySoft: "#1d3a5c",
        cream: "#F7F2E6",
        creamDeep: "#ECE3CC",
        paper: "#FFFBF1",
        white: "#FFFFFF",
        line: "rgba(11,31,51,0.12)",
        lineStrong: "rgba(11,31,51,0.25)",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"DM Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        brutal: "0 4px 0 rgba(11,31,51,0.12)",
        brutalLg:
          "0 12px 0 -2px rgba(11,31,51,0.10), 0 24px 40px -16px rgba(11,31,51,0.30)",
      },
      borderRadius: {
        brand: "18px",
        brandSm: "10px",
        brandLg: "28px",
      },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
      gridTemplateColumns: {
        hero: "1.4fr 1fr",
        heroAlt: "1.1fr 1fr",
        footer: "1.5fr 1fr 1fr",
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [],
};
