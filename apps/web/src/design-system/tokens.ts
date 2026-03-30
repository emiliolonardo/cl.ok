export const tokens = {
  color: {
    primary: "#0000FF",
    accent: "#00FFFF",
    background: "#FCFCFC",
    foreground: "#000016",
    panel: "#F3F7FF",
    line: "rgba(0,0,22,0.08)",
    success: "#00C781",
    warning: "#FFB400",
    danger: "#FF4D6D",
    info: "#3A86FF"
  },
  radius: {
    none: "0px",
    sm: "4px"
  },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "24px",
    6: "32px",
    7: "48px",
    8: "64px"
  },
  shadow: {
    sm: "0 2px 8px rgba(0,0,22,0.06)",
    md: "0 6px 18px rgba(0,0,22,0.08)",
    focus: "0 0 0 1px rgba(0,0,255,0.24), 0 0 20px rgba(0,255,255,0.08)"
  },
  font: {
    display: "DOS_Pixelcity, monospace",
    body: "IBM Plex Sans, sans-serif",
    condensed: "IBM Plex Sans Condensed, sans-serif"
  }
} as const;
