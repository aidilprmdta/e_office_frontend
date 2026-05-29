const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') ||
  'http://localhost:8000';

// Normalisasi status pengajuan (backend: pending | disetujui | ditolak)
export const normalizeStatus = (status) => (status || 'pending').toLowerCase();

export const isPendingStatus = (status) => normalizeStatus(status) === 'pending';

export const getStatusLabel = (status) => {
  const s = normalizeStatus(status);
  if (s === 'disetujui') return 'Disetujui';
  if (s === 'ditolak') return 'Ditolak';
  return 'Pending';
};

export const getUploadUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  return `${API_ORIGIN}/uploads/${fileUrl}`;
};

// Format tanggal ke format Indonesia (DD Bulan YYYY)
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

// Format tanggal ke format Indonesia dengan waktu (DD Bulan YYYY HH:MM)
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

// Check apakah user sudah login
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};


export const normalizeRole = (role) => (role || 'mahasiswa').toString().trim().toLowerCase();

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      role: normalizeRole(parsed.role),
    };
  } catch {
    return null;
  }
};

export const saveUserSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem(
    'user',
    JSON.stringify({
      ...user,
      role: normalizeRole(user.role),
    }),
  );
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

// Check apakah user memiliki role tertentu
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.map(normalizeRole).includes(userRole);
  }
  return userRole === normalizeRole(requiredRole);
};

// Truncate teks panjang
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validasi email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validasi nomor surat (format: XXXX/YYYY/MM/DD)
export const validateNomorSurat = (nomor) => {
  const re = /^\d{4}\/\d{4}\/\d{2}\/\d{2}$/;
  return re.test(nomor);
};
