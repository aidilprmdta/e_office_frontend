import apiClient from "./api";

export const authService = {
  login: (data) => apiClient.post("/auth/login", data),
  register: (data) => apiClient.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
  },
  getProfile: () => apiClient.get("/auth/me"),
};

export const pengajuanService = {
  getRiwayat: () => apiClient.get("/mahasiswa/pengajuan/me"),
  getList: () => apiClient.get("/mahasiswa/pengajuan"),
  create: (data) => apiClient.post("/mahasiswa/pengajuan", data),
  delete: (id) => apiClient.delete(`/mahasiswa/pengajuan/${id}`),
  getTracking: (id) => apiClient.get(`/mahasiswa/pengajuan/${id}/tracking`),
  kirimRevisi: (id, data) =>
    apiClient.put(`/mahasiswa/pengajuan/${id}/revisi`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const dosenService = {
  getPengajuanMasuk: () => apiClient.get("/dosen/pengajuan"),
  updateStatus: (id, data) => apiClient.put(`/dosen/pengajuan/${id}`, data),
  getTracking: (id) => apiClient.get(`/admin/pengajuan/${id}/tracking`),
  updateStatusWorkflow: (id, data) =>
    apiClient.put(`/admin/pengajuan/${id}/status`, data),
  uploadHasil: (id, formData) =>
    apiClient.post(`/admin/pengajuan/${id}/upload-hasil`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const adminPengajuanService = {
  updateStatus: (id, data) => apiClient.put(`/admin/pengajuan/${id}/status`, data),
  uploadHasil: (id, formData) =>
    apiClient.post(`/admin/pengajuan/${id}/upload-hasil`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getTracking: (id) => apiClient.get(`/admin/pengajuan/${id}/tracking`),
};

export const adminService = {
  getDashboard: () => apiClient.get("/admin/dashboard"),
  getAnalytics: (bulan = 12) =>
    apiClient.get("/admin/analytics", { params: { bulan } }),
  getUsers: () => apiClient.get("/admin/users"),
  createUser: (data) => apiClient.post("/admin/users", data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
};

export const searchService = {
  search: ({ q, jenis, status, limit }) =>
    apiClient.get("/search/", { params: { q, jenis, status, limit } }),
};

export const verifikasiService = {
  cek: (kode) => apiClient.get(`/verifikasi/${encodeURIComponent(kode)}`),
};

export const userService = adminService;

export const notifikasiService = {
  getAll: () => apiClient.get("/notifikasi/"),
  getUnreadCount: () => apiClient.get("/notifikasi/belum-dibaca"),
  markAsRead: (id) => apiClient.put(`/notifikasi/${id}/baca`),
  markAllRead: () => apiClient.put("/notifikasi/baca-semua"),
};

export { uploadService } from "./uploadService";
