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

/* ------------------------------------------------------------------
 * SEO / site-wide metadata
 * Single source of truth for the production domain and default tags.
 * Every canonical, Open Graph, Twitter and structured-data URL must
 * be built from SITE_URL so localhost / preview URLs never leak out.
 * ------------------------------------------------------------------ */
export const SITE_URL = "https://dcspars.dpdns.org";
export const SITE_NAME = "UAF Notes Sharing App";

export const DEFAULT_TITLE =
  "UAF Notes Sharing App | University of Agriculture Faisalabad";

export const DEFAULT_DESCRIPTION =
  "UAF Notes Sharing App lets University of Agriculture Faisalabad students share, browse and download course notes securely by subject and section.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_ALT =
  "UAF Notes Sharing App - notes sharing platform for University of Agriculture Faisalabad students";

/* Indexable pages and noindex pages use different robots values. */
export const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex, nofollow";

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
