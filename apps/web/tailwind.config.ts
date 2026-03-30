import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dos: {
          primary: "#0000FF",
          accent: "#00FFFF",
          bg: "#FCFCFC",
          fg: "#000016",
          panel: "#F3F7FF",
          line: "rgba(0,0,22,0.08)"
        }
      },
      borderRadius: {
        dos: "4px"
      },
      boxShadow: {
        "dos-sm": "0 2px 8px rgba(0,0,22,0.06)",
        "dos-md": "0 6px 18px rgba(0,0,22,0.08)",
        "dos-focus": "0 0 0 1px rgba(0,0,255,0.24), 0 0 20px rgba(0,255,255,0.08)"
      }
    }
  }
};

export default config;
