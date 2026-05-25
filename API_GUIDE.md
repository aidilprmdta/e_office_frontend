# 🔌 API Integration Guide

Panduan lengkap untuk integrasi dan penggunaan API backend.

---

## API Base Configuration

Semua API calls dikonfigurasi di `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**Environment Variable (Recommended)**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

Set di `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Axios Instance

```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambah token otomatis
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Services Overview

### 1. AuthService

**Login**
```javascript
await authService.login(email, password);
// POST /auth/login
// Body: { email, password }
// Returns: { token, user }
```

**Register**
```javascript
await authService.register(userData);
// POST /auth/register
// Body: { nama, email, password, role }
```

**Get Profile**
```javascript
await authService.getProfile();
// GET /auth/profile
// Headers: Authorization: Bearer <token>
```

**Logout**
```javascript
authService.logout();
// Menghapus token dari localStorage
```

---

### 2. SuratService

**Get Surat Masuk** (paginated)
```javascript
await suratService.getMasuk(page, limit);
// GET /surat/masuk?page=1&limit=10
// Returns: { data: [], total, page, limit }
```

**Get Surat Keluar** (paginated)
```javascript
await suratService.getKeluar(page, limit);
// GET /surat/keluar?page=1&limit=10
```

**Get Detail Surat**
```javascript
await suratService.getSuratDetail(id);
// GET /surat/{id}
```

**Create Surat**
```javascript
await suratService.createSurat({
  nomorSurat: '0001/2024/03/20',
  pengirim: 'Rektorat',
  perihal: 'Pengumuman Akademik',
  isi: 'Isi surat...',
  tglSurat: '2024-03-20',
  lampiran: 'file.pdf'
});
// POST /surat
```

**Update Surat**
```javascript
await suratService.updateSurat(id, updateData);
// PUT /surat/{id}
```

**Delete Surat**
```javascript
await suratService.deleteSurat(id);
// DELETE /surat/{id}
```

**Approve Surat**
```javascript
await suratService.approveSurat(id);
// POST /surat/{id}/approve
```

**Reject Surat**
```javascript
await suratService.rejectSurat(id, reason);
// POST /surat/{id}/reject
// Body: { reason }
```

---

### 3. TugasAkhirService

**Get List Tugas Akhir**
```javascript
await tugasAkhirService.getList(page, limit);
// GET /tugas-akhir?page=1&limit=10
```

**Get Detail**
```javascript
await tugasAkhirService.getDetail(id);
// GET /tugas-akhir/{id}
```

**Create**
```javascript
await tugasAkhirService.create({
  judul: 'Judul Tugas Akhir',
  mahasiswa: 'nama-mahasiswa',
  pembimbing: 'nama-dosen',
  tahun: 2024
});
// POST /tugas-akhir
```

**Update**
```javascript
await tugasAkhirService.update(id, updateData);
// PUT /tugas-akhir/{id}
```

**Delete**
```javascript
await tugasAkhirService.delete(id);
// DELETE /tugas-akhir/{id}
```

**Submit Proposal** (Upload file)
```javascript
await tugasAkhirService.submitProposal(id, file);
// POST /tugas-akhir/{id}/proposal
// FormData: { file }
```

**Approve Proposal**
```javascript
await tugasAkhirService.approveProposal(id);
// POST /tugas-akhir/{id}/approve-proposal
```

---

### 4. UserService

**Get Users** (admin only)
```javascript
await userService.getUsers(page, limit);
// GET /users?page=1&limit=10
```

**Get User Detail**
```javascript
await userService.getUserDetail(id);
// GET /users/{id}
```

**Create User** (admin only)
```javascript
await userService.createUser({
  nama: 'Nama',
  email: 'email@kampus.ac.id',
  password: 'password',
  role: 'mahasiswa' // mahasiswa, dosen, admin
});
// POST /users
```

**Update User** (admin only)
```javascript
await userService.updateUser(id, updateData);
// PUT /users/{id}
```

**Delete User** (admin only)
```javascript
await userService.deleteUser(id);
// DELETE /users/{id}
```

**Change Role** (admin only)
```javascript
await userService.changeRole(id, role);
// PUT /users/{id}/role
// Body: { role }
```

---

## Error Handling

### Try-Catch Pattern
```javascript
try {
  const response = await suratService.getMasuk();
  setLetters(response.data.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    navigate('/login');
  } else if (error.response?.status === 403) {
    // Forbidden - no permission
    setError('Anda tidak memiliki akses ke halaman ini');
  } else {
    // Other errors
    setError(error.response?.data?.message || 'Terjadi kesalahan');
  }
}
```

### Common Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK - Request berhasil |
| 201 | Created - Data berhasil dibuat |
| 400 | Bad Request - Input tidak valid |
| 401 | Unauthorized - Token invalid/expired |
| 403 | Forbidden - Tidak punya akses |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Server Error - Error di backend |

---

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Data berhasil diambil",
  "data": {
    "id": 1,
    "nomorSurat": "0001/2024/03/20",
    "pengirim": "Rektorat",
    "perihal": "Pengumuman Akademik",
    "tanggal": "2024-03-20"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Email sudah terdaftar",
  "errors": {
    "email": "Email ini sudah digunakan"
  }
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [
    { "id": 1, "nama": "..." },
    { "id": 2, "nama": "..." }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

## Implementation Examples

### Example 1: Load Data dengan Loading State
```javascript
import { useState, useEffect } from 'react';
import { suratService } from '../services';

export default function SuratList() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await suratService.getMasuk();
        setLetters(response.data.data);
      } catch (err) {
        setError('Gagal memuat data surat');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {letters.map(letter => (
        <div key={letter.id}>{letter.perihal}</div>
      ))}
    </div>
  );
}
```

### Example 2: Form Submit
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await suratService.createSurat({
      nomorSurat,
      pengirim,
      perihal,
      isi,
      tglSurat
    });
    
    // Success
    setSuccess('Surat berhasil dibuat');
    resetForm();
  } catch (err) {
    setError(err.response?.data?.message || 'Gagal membuat surat');
  } finally {
    setLoading(false);
  }
};
```

### Example 3: Approve/Reject Action
```javascript
const handleApprove = async (id) => {
  if (!window.confirm('Approve surat ini?')) return;

  try {
    await suratService.approveSurat(id);
    setSuccess('Surat berhasil disetujui');
    // Refresh list
    const response = await suratService.getMasuk();
    setLetters(response.data.data);
  } catch (err) {
    setError('Gagal menyetujui surat');
  }
};
```

---

## Backend Setup (Untuk Referensi)

Pastikan backend sudah berjalan dengan struktur endpoint:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/profile

GET    /api/surat/masuk
GET    /api/surat/keluar
GET    /api/surat/:id
POST   /api/surat
PUT    /api/surat/:id
DELETE /api/surat/:id
POST   /api/surat/:id/approve
POST   /api/surat/:id/reject

GET    /api/tugas-akhir
GET    /api/tugas-akhir/:id
POST   /api/tugas-akhir
PUT    /api/tugas-akhir/:id
DELETE /api/tugas-akhir/:id
POST   /api/tugas-akhir/:id/proposal
POST   /api/tugas-akhir/:id/approve-proposal

GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
PUT    /api/users/:id/role
```

---

## Debugging Tips

1. **Check Network Tab**
   - Buka DevTools → Network tab
   - Lihat request/response details

2. **Check Token**
   ```javascript
   console.log(localStorage.getItem('token'));
   ```

3. **Check API Base URL**
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL);
   ```

4. **Test Manual dengan cURL**
   ```bash
   curl -X GET http://localhost:5000/api/surat/masuk \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

**Pastikan backend API sudah berjalan sebelum menggunakan services ini.**