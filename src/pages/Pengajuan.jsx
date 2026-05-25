import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Button } from '../components';
import { uploadService, pengajuanService } from '../services';
import { CloudUpload, Send } from 'lucide-react';
import { suratService } from '/src/services/index.js';

export default function Pengajuan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    judulTA: '',
    perihal: '',
    kategori: 'Surat Aktif Kuliah',
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
    setSubmitting(true);
    try {
      let fileUrl = null;
      if (formData.file) {
        // Assume uploadService returns the uploaded file URL
        const uploadRes = await uploadService.upload(formData.file);
        fileUrl = uploadRes.url;
      }
      await pengajuanService.create({
        ...formData,
        fileUrl,
      });
      // After success, go to riwayat page
      navigate('/riwayat-pengajuan');
    } catch (err) {
      console.error('Pengajuan gagal', err);
      // TODO: show user-friendly toast/alert
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
        className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className="text-2xl font-bold mb-6 text-gray-800" variants={item}>
          Form Pengajuan Mahasiswa
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul TA / Perihal Surat</label>
            <input
              type="text"
              name="judulTA"
              value={formData.judulTA}
              onChange={handleChange}
              required
              className="input-field w-full"
            />
          </motion.div>

          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Pengajuan</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option>Surat Aktif Kuliah</option>
              <option>Pengajuan Judul TA</option>
              <option>Surat Izin Penelitian</option>
            </select>
          </motion.div>

          <motion.div variants={item}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Abstrak Ringkas</label>
            <textarea
              name="deskripsi"
              rows={4}
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="input-field w-full"
            ></textarea>
          </motion.div>

          <motion.div variants={item} className="flex items-center space-x-3">
            <label className="block text-sm font-medium text-gray-700">Upload File (PDF)</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </motion.div>

          <motion.div variants={item} className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="flex items-center gap-2"
            >
              <Send size={18} />
              {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </MainLayout>
  );
}
