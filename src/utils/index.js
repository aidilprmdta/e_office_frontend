import { APP_CONFIG } from '../config/appConfig';

const API_ORIGIN = APP_CONFIG.apiOrigin;

export const STATUS_FLOW = [
  { key: 'diajukan', label: 'Diajukan' },
  { key: 'diproses_admin', label: 'Diproses Admin' },
  { key: 'menunggu_tanda_tangan', label: 'Menunggu Tanda Tangan' },
  { key: 'selesai', label: 'Selesai' },
];

const LEGACY_STATUS_MAP = {
  pending: 'diajukan',
  disetujui: 'selesai',
  ditolak: 'ditolak',
};

export const normalizeStatus = (status) => {
  const s = (status || 'diajukan').toLowerCase();
  return LEGACY_STATUS_MAP[s] || s;
};

export const isPendingStatus = (status) => {
  const s = normalizeStatus(status);
  return ['diajukan', 'pending', 'diproses_admin', 'menunggu_tanda_tangan'].includes(s);
};

export const isRevisiStatus = (status) => normalizeStatus(status) === 'perlu_revisi';

export const canDeletePengajuan = (status) => {
  const s = normalizeStatus(status);
  return s === 'diajukan' || s === 'perlu_revisi';
};

export const getStatusIndex = (status) => {
  const s = normalizeStatus(status);
  if (s === 'ditolak' || s === 'perlu_revisi') return -1;
  return STATUS_FLOW.findIndex((x) => x.key === s);
};

export const getStatusLabel = (status) => {
  const s = normalizeStatus(status);
  const found = STATUS_FLOW.find((x) => x.key === s);
  if (found) return found.label;
  if (s === 'perlu_revisi') return 'Perlu Revisi';
  if (s === 'ditolak') return 'Ditolak';
  return 'Diajukan';
};

export const getStatusBadgeClass = (status) => {
  const s = normalizeStatus(status);
  if (s === 'selesai') return 'bg-green-100 text-green-700';
  if (s === 'ditolak') return 'bg-red-100 text-red-700';
  if (s === 'perlu_revisi') return 'bg-amber-100 text-amber-800';
  if (s === 'diproses_admin' || s === 'menunggu_tanda_tangan') {
    return 'bg-blue-100 text-blue-700';
  }
  return 'bg-yellow-100 text-yellow-700';
};

export const getUploadUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  return `${API_ORIGIN}/uploads/${fileUrl}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}`;
};

export const isAuthenticated = () => !!localStorage.getItem('token');

export const normalizeRole = (role) => (role || 'mahasiswa').toString().trim().toLowerCase();

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...parsed, role: normalizeRole(parsed.role) };
  } catch {
    return null;
  }
};

export const saveUserSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ ...user, role: normalizeRole(user.role) }));
  window.dispatchEvent(new Event('auth-change'));
};

export const clearUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-change'));
};

export const getUserRole = () => {
  const user = getStoredUser();
  if (user?.role) return user.role;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return normalizeRole(payload.role);
  } catch {
    return null;
  }
};

export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  if (Array.isArray(requiredRole)) {
    return requiredRole.map(normalizeRole).includes(userRole);
  }
  return userRole === normalizeRole(requiredRole);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateNomorSurat = (nomor) => {
  const re = /^\d{4}\/\d{4}\/\d{2}\/\d{2}$/;
  return re.test(nomor);
};
