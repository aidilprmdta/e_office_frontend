const apiBase =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api";

const apiOrigin = apiBase.replace(/\/api\/?$/, "") || "http://localhost:8000";

export const APP_CONFIG = {
  apiBaseUrl: apiBase,
  apiOrigin,
  apiDocsUrl: `${apiOrigin}/docs`,
  uploadsBaseUrl: `${apiOrigin}/uploads`,
  frontendUrl: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  frontendPort: Number(import.meta.env.VITE_DEV_PORT) || 5173,
  backendPort: Number(import.meta.env.VITE_BACKEND_PORT) || 8000,
  version: "2.0.0",
  releaseDate: "Mei 2026",
};

export default APP_CONFIG;
