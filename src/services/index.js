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
};

export const dosenService = {
  getPengajuanMasuk: () => apiClient.get("/dosen/pengajuan"),
  updateStatus: (id, data) => apiClient.put(`/dosen/pengajuan/${id}`, data),
};

export const adminService = {
  getDashboard: () => apiClient.get("/admin/dashboard"),
  getUsers: () => apiClient.get("/admin/users"),
  createUser: (data) => apiClient.post("/admin/users", data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
};

export const userService = adminService;

export const notifikasiService = {
  getAll: () => apiClient.get("/notifikasi/"),
  getUnreadCount: () => apiClient.get("/notifikasi/belum-dibaca"),
  markAsRead: (id) => apiClient.put(`/notifikasi/${id}/baca`),
  markAllRead: () => apiClient.put("/notifikasi/baca-semua"),
};

export { uploadService } from "./uploadService";
