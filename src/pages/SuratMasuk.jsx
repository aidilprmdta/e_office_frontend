import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Table, Button } from '../components';
import { Search, Plus, FileText } from 'lucide-react';
import { formatDate, normalizeStatus, getStatusLabel, getStatusBadgeClass, getUploadUrl } from '../utils';
import { pengajuanService, dosenService } from '../services';
import { motion } from 'framer-motion';

export default function SuratMasuk() {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'mahasiswa' };
  const userRole = user.role?.toLowerCase() || 'mahasiswa';

  const loadLetters = async () => {
    setLoading(true);
    try {
      const response =
        userRole === 'mahasiswa'
          ? await pengajuanService.getRiwayat()
          : await dosenService.getPengajuanMasuk();

      const data = response.data || [];
      const suratOnly = data.filter((item) => item.jenis_pengajuan === 'Surat');
      setLetters(suratOnly);
    } catch (err) {
      console.warn('Gagal memuat data surat:', err);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLetters();
  }, [userRole]);

  const filteredLetters = letters.filter((letter) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      (letter.judul_perihal || '').toLowerCase().includes(s) ||
      (letter.kategori || '').toLowerCase().includes(s) ||
      (letter.nama_mahasiswa || '').toLowerCase().includes(s);
    const matchStatus =
      filterStatus === 'semua' || normalizeStatus(letter.status) === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      key: 'created_at',
      label: 'Tanggal',
      render: (date) => <span className="text-sm text-gray-600">{formatDate(date)}</span>,
    },
    ...(userRole !== 'mahasiswa'
      ? [{
          key: 'nama_mahasiswa',
          label: 'Mahasiswa',
          render: (val, row) => (
            <span className="font-medium">{val || `ID: ${row.mahasiswa_id}`}</span>
          ),
        }]
      : []),
    { key: 'kategori', label: 'Kategori' },
    {
      key: 'judul_perihal',
      label: 'Perihal',
      render: (val) => <span className="font-semibold text-gray-800">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(status)}`}>
            {getStatusLabel(status)}
          </span>
        );
      },
    },
    {
      key: 'file_url',
      label: 'Lampiran',
      render: (fileUrl) =>
        fileUrl ? (
          <a
            href={getUploadUrl(fileUrl)}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1"
          >
            <FileText size={14} /> PDF
          </a>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        ),
    },
  ];

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">📨 Pengajuan Surat</h1>
            <p className="text-gray-600 mt-1">
              Daftar pengajuan administrasi surat{' '}
              {userRole === 'mahasiswa' ? 'Anda' : 'mahasiswa'}
            </p>
          </div>
          {userRole === 'mahasiswa' && (
            <Button variant="primary" onClick={() => navigate('/pengajuan')}>
              <Plus size={18} /> Ajukan Surat Baru
            </Button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari perihal, kategori, atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filteredLetters.length > 0 ? (
            <Table columns={columns} data={filteredLetters} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              Belum ada pengajuan surat.
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}
