import type { Config } from "tailwindcss";

// Identidad visual Ciudad SMT.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        smt: {
          azul: "#126ff5",
          medio: "#2589ea",
          profundo: "#28469f",
          oscuro: "#0d3fb0",
          celeste: "#3cb4f0",
          amarillo: "#F2D91C",
          tinta: "#10233d",
          texto: "#33414f",
          gris: "#6b7885",
          linea: "#e3e8ef",
          verde: "#10b981",
          rojo: "#ef4444",
          ambar: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', "Arial", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-smt": "linear-gradient(112deg, #126ff5 0%, #0d3fb0 100%)",
      },
      boxShadow: {
        tarjeta: "0 1px 2px rgba(16, 35, 61, 0.06), 0 14px 34px -20px rgba(16, 35, 61, 0.45)",
        elevada: "0 2px 4px rgba(16, 35, 61, 0.06), 0 24px 48px -24px rgba(16, 35, 61, 0.5)",
      },
      maxWidth: {
        contenido: "64rem",
      },
    },
  },
  plugins: [],
};

export default config;
