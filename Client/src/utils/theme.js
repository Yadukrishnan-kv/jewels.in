const CSS_VAR_BY_KEY = {
  primary: "--color-primary-rgb",
  secondary: "--color-secondary-rgb",
  accent: "--color-accent-rgb",
  accentLight: "--color-accent-light-rgb",
  border: "--color-border-rgb",
};

function hexToRgbTriplet(hex) {
  const clean = String(hex || "").trim().replace(/^#/, "");
  const match = clean.match(/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (!match) return null;
  return match.slice(1).map((h) => parseInt(h, 16)).join(" ");
}

export function applyThemeColors(themeColors) {
  if (!themeColors) return;
  const root = document.documentElement;
  Object.entries(CSS_VAR_BY_KEY).forEach(([key, cssVar]) => {
    const rgb = hexToRgbTriplet(themeColors[key]);
    if (rgb) root.style.setProperty(cssVar, rgb);
  });
}
