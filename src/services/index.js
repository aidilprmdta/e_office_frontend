import apiClient from "./api";

export const authService = {
  login: (data) => apiClient.post("/auth/login", data),
  register: (data) => apiClient.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getProfile: () => apiClient.get("/auth/me"),
};

export const pengajuanService = {
  getRiwayat: () => apiClient.get("/mahasiswa/pengajuan/me"),
  getList: () => apiClient.get("/mahasiswa/pengajuan"), 
  create: (data) => {
    return apiClient.post("/mahasiswa/pengajuan", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  delete: (id) => apiClient.delete(`/mahasiswa/pengajuan/${id}`),
};

export const dosenService = {
  getPengajuanMasuk: () => apiClient.get("/dosen/pengajuan"),
  
  updateStatus: (id, data) => apiClient.put(`/dosen/pengajuan/${id}`, data),
};

export const userService = {
  getUsers: () => apiClient.get("/admin/users"),
  getUserDetail: (id) => apiClient.get(`/admin/users/${id}`),
  createUser: (data) => apiClient.post("/admin/users", data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
};

export { uploadService } from "./uploadService";