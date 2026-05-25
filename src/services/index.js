import apiClient from './api';

export const pengajuanService = {
  getList: (page = 1, limit = 10) => apiClient.get(`/pengajuan?page=${page}&limit=${limit}`),
  getDetail: (id) => apiClient.get(`/pengajuan/${id}`),
  create: (data) => apiClient.post('/pengajuan', data),
};

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => localStorage.removeItem('token'),
  getProfile: () => apiClient.get('/auth/profile'),
};

export const suratService = {
  getMasuk: (page = 1, limit = 10) => apiClient.get(`/surat/masuk?page=${page}&limit=${limit}`),
  getKeluar: (page = 1, limit = 10) => apiClient.get(`/surat/keluar?page=${page}&limit=${limit}`),
  getSuratDetail: (id) => apiClient.get(`/surat/${id}`),
  createSurat: (data) => apiClient.post('/surat', data),
  updateSurat: (id, data) => apiClient.put(`/surat/${id}`, data),
  deleteSurat: (id) => apiClient.delete(`/surat/${id}`),
  approveSurat: (id) => apiClient.post(`/surat/${id}/approve`),
  rejectSurat: (id, reason) => apiClient.post(`/surat/${id}/reject`, { reason }),
};

export const tugasAkhirService = {
  getList: (page = 1, limit = 10) => apiClient.get(`/tugas-akhir?page=${page}&limit=${limit}`),
  getDetail: (id) => apiClient.get(`/tugas-akhir/${id}`),
  create: (data) => apiClient.post('/tugas-akhir', data),
  update: (id, data) => apiClient.put(`/tugas-akhir/${id}`, data),
  delete: (id) => apiClient.delete(`/tugas-akhir/${id}`),
  submitProposal: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/tugas-akhir/${id}/proposal`, formData);
  },
  approveProposal: (id) => apiClient.post(`/tugas-akhir/${id}/approve-proposal`),
};

export const userService = {
  getUsers: (page = 1, limit = 10) => apiClient.get(`/users?page=${page}&limit=${limit}`),
  getUserDetail: (id) => apiClient.get(`/users/${id}`),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  changeRole: (id, role) => apiClient.put(`/users/${id}/role`, { role }),
};
