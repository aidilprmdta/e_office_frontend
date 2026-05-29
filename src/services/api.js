import axios from "axios";

// Pastikan baseURL API konsisten dan selalu mengarah ke backend yang benar
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000/api"
    : "https://your-production-domain/api");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan token ke setiap request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // PENTING: Jika data adalah FormData (upload file), hapus Content-Type
  // agar browser otomatis set 'multipart/form-data' dengan boundary yang benar
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export default apiClient;

