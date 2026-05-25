import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Table, Button, Card } from '../components';
import { Search, Plus, Eye, Trash2, X, GraduationCap, Upload, CheckCircle, FileText, Calendar, User, BookOpen } from 'lucide-react';
import { formatDate } from '../utils';
import { tugasAkhirService } from '../services';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function TugasAkhir() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  // User State
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'mahasiswa', nama: 'Guest' };
  const userRole = user.role?.toLowerCase() || 'mahasiswa';

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    judul: '',
    mahasiswa: userRole === 'mahasiswa' ? user.nama : '',
    pembimbing: '',
    tahun: new Date().getFullYear(),
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await tugasAkhirService.getList(currentPage, limit);
      const data = response.data.data || response.data || [];
      const total = response.data.total || data.length || 0;
      setTasks(data);
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.warn('Failed to load Tugas Akhir from API. Using fallback mock data.');
      // Mock Tugas Akhir list
      const mockData = [
        {
          id: 1,
          judul: 'Sistem Deteksi Penyakit Tanaman Padi Berbasis Computer Vision',
          mahasiswa: 'Muhammad Aji',
          pembimbing: 'Dr. Sukarno',
          tahun: 2026,
          status: 'Proposal Disetujui',
          tanggal: '2026-05-15',
          proposalFile: 'proposal_aji_deteksi_padi.pdf'
        },
        {
          id: 2,
          judul: 'Rancang Bangun Robot Pembersih Sampah Otomatis Menggunakan IoT',
          mahasiswa: 'Budi Santoso',
          pembimbing: 'Dr. Sukarno',
          tahun: 2026,
          status: 'Proposal Pending',
          tanggal: '2026-05-12',
          proposalFile: 'proposal_budi_robot_pembasmi.pdf'
        },
        {
          id: 3,
          judul: 'Optimasi Jaringan SD-WAN Pada Infrastruktur Kampus',
          mahasiswa: 'Siti Nurhaliza',
          pembimbing: 'Prof. Bambang',
          tahun: 2026,
          status: 'Proposal Draf',
          tanggal: '2026-05-05',
          proposalFile: null
        },
      ];
      setTasks(mockData);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentPage]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await tugasAkhirService.create(formData);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Tugas Akhir berhasil diajukan.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
      setShowCreateModal(false);
      setFormData({
        judul: '',
        mahasiswa: userRole === 'mahasiswa' ? user.nama : '',
        pembimbing: '',
        tahun: new Date().getFullYear(),
      });
      loadTasks();
    } catch (err) {
      // Fake insert offline
      const newTask = {
        id: Date.now(),
        ...formData,
        status: 'Proposal Draf',
        tanggal: new Date().toISOString().split('T')[0],
      };
      setTasks([newTask, ...tasks]);
      setShowCreateModal(false);
      Swal.fire({
        title: 'Sukses (Offline)',
        text: 'Tugas Akhir diajukan secara lokal.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await tugasAkhirService.submitProposal(selectedTask.id, selectedFile);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Proposal PDF berhasil diunggah.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
      setShowUploadModal(false);
      setSelectedFile(null);
      loadTasks();
    } catch (err) {
      // Mock update local state
      setTasks(tasks.map(t => {
        if (t.id === selectedTask.id) {
          return { ...t, proposalFile: selectedFile.name, status: 'Proposal Pending' };
        }
        return t;
      }));
      setShowUploadModal(false);
      setSelectedFile(null);
      Swal.fire({
        title: 'Diunggah (Offline)',
        text: 'File proposal diunggah secara lokal.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleApprove = async (id) => {
    try {
      await tugasAkhirService.approveProposal(id);
      Swal.fire({
        title: 'Disetujui!',
        text: 'Proposal tugas akhir telah disetujui.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
      loadTasks();
    } catch (err) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Proposal Disetujui' } : t));
      Swal.fire({
        title: 'Disetujui (Offline)',
        text: 'Proposal disetujui secara lokal.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Tugas Akhir?',
      text: 'Data yang terhapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await tugasAkhirService.delete(id);
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
        });
        loadTasks();
      } catch (err) {
        setTasks(tasks.filter(t => t.id !== id));
        Swal.fire({
          title: 'Terhapus (Offline)',
          text: 'Tugas Akhir dihapus dari local state.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      (task.judul || '').toLowerCase().includes(s) ||
      (task.mahasiswa || '').toLowerCase().includes(s) ||
      (task.pembimbing || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'semua' || task.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    { 
      key: 'judul', 
      label: 'Judul Tugas Akhir',
      render: (val) => <span className="font-bold text-gray-800 line-clamp-2">{val}</span>
    },
    { key: 'mahasiswa', label: 'Mahasiswa' },
    { key: 'pembimbing', label: 'Pembimbing' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            status?.toLowerCase().includes('setuju') || status?.toLowerCase().includes('diterima')
              ? 'bg-green-100 text-green-700'
              : status?.toLowerCase().includes('pending')
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {status || 'Draf'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Aksi',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedTask(row); setShowDetailModal(true); }}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
            title="Lihat Detail"
          >
            <Eye size={16} />
          </button>
          
          {userRole === 'mahasiswa' && !row.proposalFile && (
            <button
              onClick={() => { setSelectedTask(row); setShowUploadModal(true); }}
              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-md transition-colors"
              title="Unggah Proposal PDF"
            >
              <Upload size={16} />
            </button>
          )}

          {['dosen', 'admin'].includes(userRole) && row.status?.toLowerCase() !== 'proposal disetujui' && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-md transition-colors"
              title="Setujui Proposal"
            >
              <CheckCircle size={16} />
            </button>
          )}

          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <span>🎓</span> Tugas Akhir
            </h1>
            <p className="text-gray-600 mt-1">Pantau dan kelola pengajuan Proposal & Tugas Akhir mahasiswa</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} /> Ajukan Judul
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari judul, mahasiswa, atau dosen pembimbing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="semua">Semua Status</option>
              <option value="Proposal Disetujui">Proposal Disetujui</option>
              <option value="Proposal Pending">Proposal Pending</option>
              <option value="Proposal Draf">Proposal Draf</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <Table columns={columns} data={filteredTasks} />
              
              {totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Sebelumnya
                  </Button>
                  <span className="px-4 py-1 text-sm font-semibold flex items-center text-gray-700 bg-gray-100 rounded-lg">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Berikutnya
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="text-blue-600" size={24} />
                  Pengajuan Judul Tugas Akhir
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Penelitian</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tuliskan judul proposal Tugas Akhir secara lengkap..."
                    value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Mahasiswa</label>
                    <input
                      type="text"
                      required
                      readOnly={userRole === 'mahasiswa'}
                      value={formData.mahasiswa}
                      onChange={(e) => setFormData({...formData, mahasiswa: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tahun Pengajuan</label>
                    <input
                      type="number"
                      required
                      value={formData.tahun}
                      onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dosen Pembimbing Utama</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama dosen beserta gelar lengkap"
                    value={formData.pembimbing}
                    onChange={(e) => setFormData({...formData, pembimbing: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" type="submit">
                    Ajukan Sekarang
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPLOAD PROPOSAL MODAL */}
      <AnimatePresence>
        {showUploadModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Upload className="text-purple-600" size={20} />
                  Unggah Dokumen Proposal PDF
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <p className="text-xs text-gray-500">
                  Judul: <strong className="text-gray-700">{selectedTask.judul}</strong>
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-600">
                    {selectedFile ? selectedFile.name : 'Pilih file PDF Proposal'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" type="button" onClick={() => setShowUploadModal(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" type="submit" disabled={!selectedFile}>
                    Unggah File
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="text-blue-600" size={24} />
                  Detail Tugas Akhir
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Mahasiswa Pengaju</p>
                      <p className="text-sm font-bold text-gray-800">{selectedTask.mahasiswa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Dosen Pembimbing</p>
                      <p className="text-sm font-bold text-gray-800">{selectedTask.pembimbing}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Tahun / Tanggal Pengajuan</p>
                      <p className="text-sm font-bold text-gray-800">
                        Tahun {selectedTask.tahun} — {formatDate(selectedTask.tanggal || new Date())}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Judul Tugas Akhir</h4>
                  <p className="text-base font-bold text-gray-800 leading-snug">{selectedTask.judul}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTask.status?.toLowerCase().includes('setuju')
                        ? 'bg-green-100 text-green-700'
                        : selectedTask.status?.toLowerCase().includes('pending')
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {selectedTask.status || 'Draf'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">File Proposal</h4>
                  {selectedTask.proposalFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-red-500" />
                        <span className="text-sm font-semibold text-gray-700 truncate max-w-xs">{selectedTask.proposalFile}</span>
                      </div>
                      <span className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">Unduh PDF</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center">
                      Belum ada dokumen proposal PDF yang diunggah.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
