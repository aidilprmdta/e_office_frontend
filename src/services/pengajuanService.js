import apiClient from './api';

// Service handling mahasiswa pengajuan (submission) operations
export const pengajuanService = {
  // Fetch list of submissions (with optional pagination)
  getList: (page = 1, limit = 10) =>
    apiClient.get(`/pengajuan?page=${page}&limit=${limit}`),

  // Create a new submission
  create: (data) => apiClient.post('/pengajuan', data),

  // Delete a submission by id
  delete: (id) => apiClient.delete(`/pengajuan/${id}`),

  // Cancel a submission (could be a PATCH to set status to 'cancelled')
  cancel: (id) => apiClient.patch(`/pengajuan/${id}/cancel`),
};
