// MockForge Design Tokens
// Professional API Management / SaaS UI
// Dark navigation + clean workspace + amber/violet accents

export const ink = {
  950: "#080B12",
  900: "#0F131C",
  850: "#151A24",
  800: "#1B2230",
  700: "#252D3D",
  600: "#344054",
  500: "#475467",
  400: "#667085",
  300: "#98A2B3",
  200: "#D0D5DD",
  100: "#EAECF0",
  50: "#F8FAFC",
  white: "#FFFFFF",
};

export const amber = {
  main: "#F59E0B",
  light: "#FBBF24",
  dark: "#D97706",
  contrast: "#111827",
};

export const violet = {
  main: "#7C3AED",
  light: "#A78BFA",
  dark: "#6D28D9",
  contrast: "#FFFFFF",
};

export const blue = {
  main: "#2563EB",
  light: "#60A5FA",
  dark: "#1D4ED8",
  contrast: "#FFFFFF",
};

export const green = {
  main: "#16A34A",
  light: "#4ADE80",
  dark: "#15803D",
  contrast: "#FFFFFF",
};

export const red = {
  main: "#DC2626",
  light: "#F87171",
  dark: "#B91C1C",
  contrast: "#FFFFFF",
};

export const orange = {
  main: "#EA580C",
  light: "#FB923C",
  dark: "#C2410C",
  contrast: "#FFFFFF",
};

// HTTP method colors
export const methodColors: Record<string, string> = {
  GET: "#2563EB",
  POST: "#16A34A",
  PUT: "#D97706",
  PATCH: "#7C3AED",
  DELETE: "#DC2626",
  HEAD: "#475467",
  OPTIONS: "#667085",
};

// HTTP status colors
export const statusColor = (status: number): string => {
  if (status >= 200 && status < 300) return green.main;
  if (status >= 300 && status < 400) return blue.main;
  if (status >= 400 && status < 500) return amber.main;
  if (status >= 500) return red.main;

  return ink[500];
};

// Status backgrounds
export const statusBackground = (status: number): string => {
  if (status >= 200 && status < 300) return "#ECFDF3";
  if (status >= 300 && status < 400) return "#EFF6FF";
  if (status >= 400 && status < 500) return "#FFFAEB";
  if (status >= 500) return "#FEF2F2";

  return ink[50];
};

// Fonts
export const fontHeading = '"Space Grotesk", "Inter", sans-serif';

export const fontBody = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const fontMono = '"JetBrains Mono", "Fira Code", Consolas, monospace';

// Common UI dimensions
export const layout = {
  sidebarWidth: 260,
  sidebarCollapsedWidth: 72,
  headerHeight: 64,
  contentMaxWidth: 1600,
};

// Border radius
export const radius = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
};

// Shadows
export const shadows = {
  card: "0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)",
  cardHover:
    "0 8px 24px rgba(16, 24, 40, 0.10), 0 2px 6px rgba(16, 24, 40, 0.06)",
  dialog:
    "0 20px 40px rgba(16, 24, 40, 0.18), 0 8px 16px rgba(16, 24, 40, 0.08)",
};

// Workspace colors
export const workspace = {
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  border: "#E4E7EC",
  borderStrong: "#D0D5DD",
  text: "#101828",
  textSecondary: "#475467",
  textMuted: "#667085",
};

// Sidebar colors
export const sidebar = {
  background: "#0F131C",
  surface: "#151A24",
  hover: "#1B2230",
  active: "#252D3D",
  border: "#252D3D",
  text: "#F8FAFC",
  textSecondary: "#98A2B3",
  textMuted: "#667085",
  accent: amber.main,
};

// Chart colors
export const chartColors = {
  primary: blue.main,
  secondary: violet.main,
  success: green.main,
  warning: amber.main,
  error: red.main,
  info: "#0EA5E9",
  neutral: "#98A2B3",
};