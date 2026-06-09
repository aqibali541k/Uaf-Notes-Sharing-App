export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const CATEGORIES = [
  "Stat-402",
  "Cs-408",
  "Cs-412",
  "Cs-410",
  "Cs-406",
  "Bms-402",
  "Is-402",
  "Announcements",
];

export const NOTE_STATUS = {
  PUBLIC: "public",
  PRIVATE: "private",
  SHARED: "shared",
};

export const COLORS = {
  primary: "#4f46e5", // Indigo 600
  secondary: "#10b981", // Emerald 500
  accent: "#f59e0b", // Amber 500
  danger: "#ef4444", // Red 500
  info: "#3b82f6", // Blue 500
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  }
};
