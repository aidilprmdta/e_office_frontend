import axios from "axios";

/**
 * URL API backend — harus sama dengan uvicorn (default port 8000).
 * Atur di .env: VITE_API_BASE_URL=http://localhost:8000/api
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const base = API_BASE_URL.replace(/\/api\/?$/, "");
      error.userMessage = `Tidak dapat terhubung ke server API (${base}). Pastikan backend berjalan: uvicorn app.main:app --reload --port 8000`;
    }
    return Promise.reject(error);
  },
);

export { API_BASE_URL };
export default apiClient;
