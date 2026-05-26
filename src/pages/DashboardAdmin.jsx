import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Card, Table } from '../components';
import { UserPlus, Shield, Users, Trash2, Edit, Search, ShieldAlert, History } from 'lucide-react';
import Swal from 'sweetalert2';

// CATATAN: Import adminService dimatikan sementara agar halaman tidak error/crash
// Nanti jika backend sudah siap, hapus komentar di bawah ini:
// import { adminService } from '../services';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({ totalUsers: 0, mahasiswa: 0, dosen: 0, totalLogs: 0 });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // ⚠️ SIMULASI: Jika adminService belum siap, kita langsung lempar ke catch (Mock Data)
      // Nanti ganti dengan: const userRes = await adminService.getAllUsers();
      throw new Error("Memaksa penggunaan Mock Data untuk UI Testing");
      
    } catch (err) {
      console.warn("Menggunakan fallback mock data karena API belum terhubung.");
      
      const mockUsers = [
        { id: 1, username: 'aidilprmdta', nama: 'Aidil Pramadita Putra', role: 'mahasiswa' },
        { id: 2, username: 'dosen_pweb', nama: 'Pak Dosen Pemrograman Web', role: 'dosen' },
        { id: 3, username: 'admin_faste', nama: 'Staff TU FASTE', role: 'admin' },
      ];

      const mockLogs = [
        { id: 1, user: 'admin_faste', aksi: 'Membuat akun dosen baru: dosen_pweb', waktu: '2026-05-26T10:00:00Z' },
        { id: 2, id_pengajuan: 12, user: 'aidilprmdta', aksi: 'Mengajukan dokumen: Surat Izin Penelitian', waktu: '2026-05-26T09:15:00Z' },
        { id: 3, id_pengajuan: 12, user: 'dosen_pweb', aksi: 'Mengubah status pengajuan ID 12 menjadi disetujui', waktu: '2026-05-26T11:00:00Z' },
      ];

      setUsers(mockUsers);
      setLogs(mockLogs);
      calculateStats(mockUsers, mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData, logData) => {
    setStats({
      totalUsers: userData.length,
      mahasiswa: userData.filter(u => u.role === 'mahasiswa').length,
      dosen: userData.filter(u => u.role === 'dosen').length,
      totalLogs: logData.length
    });
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleOpenUserModal = async (userToEdit = null) => {
    const isEdit = !!userToEdit;
    
    // PERBAIKAN: Menggunakan Optional Chaining (?.) agar terhindar dari TypeError saat null
    const { value: formValues } = await Swal.fire({
      title: isEdit ? '📝 Edit Akun Pengguna' : '🚀 Tambah Pengguna Baru',
      html: `
        <div class="space-y-3 text-left">
          <label class="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap</label>
          <input id="swal-nama" class="swal2-input w-full m-0 mb-3 px-3 py-2 text-sm border rounded-lg" value="${userToEdit?.nama || ''}" placeholder="Cth: Aidil Pramadita Putra">
          
          <label class="block text-xs font-bold text-gray-600 mb-1">Username (NIM / NIDN)</label>
          <input id="swal-username" class="swal2-input w-full m-0 mb-3 px-3 py-2 text-sm border rounded-lg" value="${userToEdit?.username || ''}" placeholder="Username unik" ${isEdit ? 'disabled style="background: #f3f4f6"' : ''}>
          
          <label class="block text-xs font-bold text-gray-600 mb-1">Password ${isEdit ? '(Kosongkan jika tidak diubah)' : ''}</label>
          <input id="swal-password" type="password" class="swal2-input w-full m-0 mb-3 px-3 py-2 text-sm border rounded-lg" placeholder="Minimal 6 karakter">
          
          <label class="block text-xs font-bold text-gray-600 mb-1">Role / Hak Akses</label>
          <select id="swal-role" class="swal2-input w-full m-0 px-3 py-2 text-sm border rounded-lg">
            <option value="mahasiswa" ${userToEdit?.role === 'mahasiswa' ? 'selected' : ''}>Mahasiswa</option>
            <option value="dosen" ${userToEdit?.role === 'dosen' ? 'selected' : ''}>Dosen</option>
            <option value="admin" ${userToEdit?.role === 'admin' ? 'selected' : ''}>Admin / Staff</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#6B7280',
      confirmButtonText: isEdit ? 'Simpan Perubahan' : 'Daftarkan User',
      preConfirm: () => {
        const nama = document.getElementById('swal-nama')?.value;
        const username = document.getElementById('swal-username')?.value;
        const password = document.getElementById('swal-password')?.value;
        const role = document.getElementById('swal-role')?.value;
        
        if (!nama || !username || (!isEdit && !password)) {
          Swal.showValidationMessage('Harap isi semua kolom yang wajib!');
          return false;
        }
        return { nama, username, password, role };
      }
    });

    if (formValues) {
      try {
        // Nanti ganti komentar ini dengan pemanggilan API adminService
        if (isEdit) {
          setUsers(prev => prev.map(u => u.id === userToEdit.id ? { ...u, ...formValues } : u));
        } else {
          const newUser = { id: Date.now(), ...formValues };
          setUsers(prev => [...prev, newUser]);
        }
        Swal.fire('Berhasil!', 'Data terupdate secara lokal pada tampilan (Offline Mode).', 'success');
        calculateStats(users, logs); // Update counter
      } catch (err) {
        Swal.fire('Error', 'Terjadi kesalahan.', 'error');
      }
    }
  };

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: 'Hapus Akun Pengguna?',
      text: `Apakah Anda yakin ingin menghapus akun ${user.nama}? Seluruh data pengajuan terkait akan ikut terhapus otomatis.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      Swal.fire('Terhapus!', 'Pengguna dihapus dari penayangan lokal.', 'success');
    }
  };

  const filteredUsers = users.filter(u =>
    (u.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userColumns = [
    { key: 'username', label: 'NIM / NIDN', render: (val) => <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">{val}</span> },
    { key: 'nama', label: 'Nama Lengkap', render: (val) => <span className="font-semibold text-gray-800">{val}</span> },
    { 
      key: 'role', 
      label: 'Hak Akses', 
      render: (val) => {
        const colors = val === 'admin' ? 'bg-red-50 text-red-700 border-red-200' : val === 'dosen' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200';
        return <span className={`px-2 py-1 border rounded-md text-xs font-bold uppercase tracking-wider ${colors}`}>{val}</span>;
      } 
    },
    {
      key: 'id',
      label: 'Manajemen',
      render: (id, row) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpenUserModal(row)} className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200" title="Edit Pengguna"><Edit size={14} /></button>
          <button onClick={() => handleDeleteUser(row)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200" title="Hapus Pengguna"><Trash2 size={14} /></button>
        </div>
      )
    }
  ];

  const logColumns = [
    { key: 'waktu', label: 'Waktu Kejadian', render: (val) => <span className="text-xs text-gray-400 font-mono">{new Date(val).toLocaleString('id-ID')}</span> },
    { key: 'user', label: 'Aktor (User)', render: (val) => <span className="font-bold text-blue-700">@{val}</span> },
    { key: 'aksi', label: 'Log Aktivitas', render: (val) => <span className="text-sm font-medium text-gray-600">{val}</span> },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <Shield className="text-blue-600" /> Control Panel Admin
            </h1>
            <p className="text-gray-500 mt-1">Pusat kendali autentikasi user dan rekam jejak aktivitas E-Office</p>
          </div>
          <button onClick={() => handleOpenUserModal(null)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm self-start sm:self-center">
            <UserPlus size={16} /> Tambah User Baru
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card icon="👥" title="Total Akun" value={stats.totalUsers} color="blue" />
          <Card icon="🎓" title="Mahasiswa" value={stats.mahasiswa} color="indigo" />
          <Card icon="👨‍🏫" title="Dosen" value={stats.dosen} color="green" />
          <Card icon="📜" title="Total Log" value={stats.totalLogs} color="red" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button onClick={() => { setActiveTab('users'); setSearchTerm(''); }} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'users' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Users size={16} /> Manajemen Pengguna
            </button>
            <button onClick={() => { setActiveTab('logs'); setSearchTerm(''); }} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'logs' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <History size={16} /> Log Aktivitas Sistem
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari user berdasarkan nama, username, atau role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 focus:bg-white transition-all text-sm"
                  />
                </div>
                {loading ? (
                  <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
                ) : (
                  <Table columns={userColumns} data={filteredUsers} />
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <ShieldAlert size={14} className="shrink-0" /> Log aktivitas bersifat read-only (Immutable) untuk keperluan audit keamanan digital kampus.
                </div>
                {loading ? (
                  <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
                ) : (
                  <Table columns={logColumns} data={logs} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}