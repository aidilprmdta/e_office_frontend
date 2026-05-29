import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Button } from '../components';
import { pengajuanService } from '../services';
import { Send, FileText, BookOpen } from 'lucide-react';
import Swal from 'sweetalert2';

const CONFIG = {
  surat: {
    jenis: 'Surat',
    kategori: 'Surat Aktif Kuliah',
    title: 'Form Pengajuan Surat',
    subtitle: 'Ajukan surat administrasi akademik (aktif kuliah, izin penelitian, dll).',
    icon: FileText,
    iconColor: 'text-blue-600',
    judulPlaceholder: 'Contoh: Permohonan Surat Keterangan Aktif Kuliah',
    kategoriPlaceholder: 'Contoh: Surat Aktif Kuliah, Izin Penelitian',
    deskripsiPlaceholder: 'Jelaskan maksud dan tujuan pengajuan surat...',
    successRedirect: '/riwayat-pengajuan',
    lockJenis: false,
  },
  ta: {
    jenis: 'Tugas Akhir',
    kategori: 'Pengajuan Judul TA',
    title: 'Form Pengajuan Judul Tugas Akhir',
    subtitle:
      'Mahasiswa mengajukan judul TA beserta proposal PDF. Dosen/Admin akan meninjau di menu Persetujuan.',
    icon: BookOpen,
    iconColor: 'text-purple-600',
    judulPlaceholder: 'Contoh: Rancang Bangun Sistem E-Office Berbasis Web',
    kategoriPlaceholder: 'Contoh: Sistem Informasi, Jaringan, AI',
    deskripsiPlaceholder: 'Tuliskan abstrak ringkas, latar belakang, dan tujuan penelitian...',
    successRedirect: '/tugas-akhir',
    lockJenis: true,
  },
};

export default function Pengajuan({ mode = 'surat' }) {
  const navigate = useNavigate();
  const cfg = CONFIG[mode] || CONFIG.surat;
  const HeaderIcon = cfg.icon;

  const [formData, setFormData] = useState({
    judul_perihal: '',
    jenis_pengajuan: cfg.jenis,
    kategori: cfg.kategori,
    deskripsi: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      Swal.fire('File Kosong', 'Harap unggah dokumen proposal/judul TA (PDF).', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('judul_perihal', formData.judul_perihal);
      submitData.append('jenis_pengajuan', formData.jenis_pengajuan);
      submitData.append('kategori', formData.kategori);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('file', formData.file);

      await pengajuanService.create(submitData);

      Swal.fire({
        title: 'Berhasil!',
        text:
          mode === 'ta'
            ? 'Judul Tugas Akhir berhasil diajukan. Pantau status di menu Tugas Akhir.'
            : 'Pengajuan surat berhasil dikirim ke Dosen/Admin.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      }).then(() => navigate(cfg.successRedirect));
    } catch (err) {
      console.error('Pengajuan gagal', err);
      Swal.fire(
        'Gagal Mengirim',
        err.response?.data?.detail || 'Terjadi kesalahan pada server. Coba lagi nanti.',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mt-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="mb-6 border-b border-gray-100 pb-4">
          <h2 className={`text-2xl font-extrabold text-gray-800 flex items-center gap-2`}>
            <HeaderIcon className={cfg.iconColor} /> {cfg.title}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">{cfg.subtitle}</p>
          {mode === 'ta' && (
            <p className="text-xs text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 mt-3">
              Pengaju: <strong>Mahasiswa</strong> · Peninjau: <strong>Dosen & Admin/Staff</strong>
            </p>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {!cfg.lockJenis && (
              <motion.div variants={item}>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Pengajuan</label>
                <select
                  name="jenis_pengajuan"
                  value={formData.jenis_pengajuan}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="Surat">Administrasi Surat</option>
                  <option value="Tugas Akhir">Tugas Akhir / Proposal</option>
                </select>
              </motion.div>
            )}

            <motion.div variants={item} className={cfg.lockJenis ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                {mode === 'ta' ? 'Bidang / Kategori TA' : 'Kategori / Topik'}
              </label>
              <input
                type="text"
                name="kategori"
                placeholder={cfg.kategoriPlaceholder}
                value={formData.kategori}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </motion.div>
          </div>

          <motion.div variants={item}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              {mode === 'ta' ? 'Judul Tugas Akhir' : 'Judul Perihal'}
            </label>
            <input
              type="text"
              name="judul_perihal"
              placeholder={cfg.judulPlaceholder}
              value={formData.judul_perihal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </motion.div>

          <motion.div variants={item}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi / Abstrak</label>
            <textarea
              name="deskripsi"
              rows={4}
              placeholder={cfg.deskripsiPlaceholder}
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </motion.div>

          <motion.div
            variants={item}
            className={`p-4 border-2 border-dashed rounded-xl ${
              mode === 'ta'
                ? 'bg-purple-50 border-purple-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Upload Proposal / Dokumen (Wajib PDF, maks. 5MB)
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </motion.div>

          <motion.div variants={item} className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl"
            >
              <Send size={18} />
              {submitting ? 'Mengirim...' : mode === 'ta' ? 'Ajukan Judul TA' : 'Kirim Pengajuan'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </MainLayout>
  );
}
