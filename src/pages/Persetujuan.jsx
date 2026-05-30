import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../layouts';
import { Table, Card } from '../components';
import { Check, X, Search, Eye, FileText, Upload, RotateCcw } from 'lucide-react';
import {
  formatDate,
  normalizeStatus,
  getStatusLabel,
  getStatusBadgeClass,
  getUploadUrl,
} from '../utils';
import { dosenService } from '../services';
import Swal from 'sweetalert2';

const ACTIVE_STATUSES = [
  'diajukan',
  'diproses_admin',
  'menunggu_tanda_tangan',
  'perlu_revisi',
  'pending',
];

export default function Persetujuan() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ pending: 0, disetujui: 0, ditolak: 0 });
  const uploadInputRef = useRef(null);
  const [uploadTargetId, setUploadTargetId] = useState(null);

  const loadLetters = async () => {
    setLoading(true);
    try {
      const response = await dosenService.getPengajuanMasuk();
      const data = response.data || [];
      const activeList = data.filter((l) =>
        ACTIVE_STATUSES.includes(normalizeStatus(l.status)),
      );
      setLetters(activeList);
      setStats({
        pending: activeList.length,
        disetujui: data.filter((l) => normalizeStatus(l.status) === 'selesai').length,
        ditolak: data.filter((l) => normalizeStatus(l.status) === 'ditolak').length,
      });
    } catch (err) {
      console.warn('Gagal memuat data:', err);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLetters();
  }, []);

  const updateWorkflow = async (id, payload) => {
    try {
      await dosenService.updateStatusWorkflow(id, payload);
      Swal.fire('Berhasil', 'Status pengajuan diperbarui.', 'success');
      loadLetters();
    } catch (err) {
      const detail = err.response?.data?.detail;
      Swal.fire('Gagal', typeof detail === 'string' ? detail : 'Gagal memperbarui status.', 'error');
    }
  };

  const handleProses = (id) =>
    updateWorkflow(id, { status: 'diproses_admin', catatan: 'Sedang diproses admin' });

  const handleMenungguTTD = (id) =>
    updateWorkflow(id, { status: 'menunggu_tanda_tangan' });

  const handleRevisi = async (id) => {
    const { value: catatan } = await Swal.fire({
      title: 'Minta Revisi',
      input: 'textarea',
      inputLabel: 'Catatan Revisi / Alasan (wajib min. 10 karakter)',
      inputValidator: (v) => {
        if (!v || v.trim().length < 10) return 'Catatan revisi wajib diisi';
      },
      showCancelButton: true,
      confirmButtonText: 'Kirim ke Mahasiswa',
    });
    if (catatan) {
      await updateWorkflow(id, { status: 'perlu_revisi', catatan_revisi: catatan });
    }
  };

  const handleSelesai = async (id, row) => {
    if (!row.file_hasil_url) {
      Swal.fire(
        'Upload Diperlukan',
        'Unggah dokumen surat jadi terlebih dahulu sebelum menandai selesai.',
        'warning',
      );
      return;
    }
    await updateWorkflow(id, { status: 'selesai', catatan: 'Surat selesai diproses' });
  };

  const handleTolak = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'Tolak Pengajuan?',
      input: 'text',
      inputLabel: 'Alasan Penolakan (Wajib)',
      inputValidator: (v) => (!v ? 'Alasan wajib diisi' : undefined),
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Ya, Tolak',
    });
    if (reason) {
      await updateWorkflow(id, { status: 'ditolak', catatan: reason });
    }
  };

  const triggerUpload = (id) => {
    setUploadTargetId(id);
    uploadInputRef.current?.click();
  };

  const handleUploadHasil = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTargetId) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Format Salah', 'Hanya PDF yang diizinkan.', 'warning');
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    try {
      await dosenService.uploadHasil(uploadTargetId, fd);
      Swal.fire('Berhasil', 'Dokumen hasil diunggah. Mahasiswa akan mendapat notifikasi.', 'success');
      loadLetters();
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.detail || 'Upload gagal.', 'error');
    } finally {
      e.target.value = '';
      setUploadTargetId(null);
    }
  };

  const openDetail = async (letter) => {
    let tracking = null;
    try {
      const res = await dosenService.getTracking(letter.id);
      tracking = res.data;
    } catch {
      /* ignore */
    }

    await Swal.fire({
      title: letter.judul_perihal,
      html: `
        <div class="text-left text-sm space-y-2">
          <p><strong>Jenis:</strong> ${letter.jenis_pengajuan}</p>
          <p><strong>Kategori:</strong> ${letter.kategori || '-'}</p>
          <p><strong>Status:</strong> ${getStatusLabel(letter.status)}</p>
          <p><strong>Deskripsi:</strong> ${letter.deskripsi || '-'}</p>
          ${letter.catatan_revisi ? `<p class="text-amber-700"><strong>Catatan revisi:</strong> ${letter.catatan_revisi}</p>` : ''}
          ${(tracking?.kode_verifikasi || letter.kode_verifikasi) ? `<p class="text-green-700"><strong>Kode verifikasi:</strong> ${tracking?.kode_verifikasi || letter.kode_verifikasi}</p>` : ''}
        </div>
      `,
      confirmButtonText: 'Tutup',
      width: 560,
    });
  };

  const filteredLetters = letters.filter((letter) =>
    (letter.judul_perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (letter.kategori || '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      key: 'created_at',
      label: 'Tanggal',
      render: (date) => <span className="text-sm text-gray-600">{formatDate(date)}</span>,
    },
    {
      key: 'nama_mahasiswa',
      label: 'Mahasiswa',
      render: (val) => <span className="font-medium">{val || '-'}</span>,
    },
    {
      key: 'jenis_pengajuan',
      label: 'Jenis',
      render: (val) => (
        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
          {val}
        </span>
      ),
    },
    { key: 'judul_perihal', label: 'Judul / Perihal' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(status)}`}>
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Aksi',
      render: (id, row) => {
        const s = normalizeStatus(row.status);
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            <button
              onClick={() => openDetail(row)}
              className="p-1.5 bg-blue-50 text-blue-600 rounded-md"
              title="Detail"
            >
              <Eye size={14} />
            </button>
            {(s === 'diajukan' || s === 'pending') && (
              <button
                onClick={() => handleProses(id)}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md"
              >
                Proses
              </button>
            )}
            {['diajukan', 'diproses_admin', 'pending'].includes(s) && (
              <button
                onClick={() => handleMenungguTTD(id)}
                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-md"
              >
                TTD
              </button>
            )}
            <button
              onClick={() => triggerUpload(id)}
              className="p-1.5 bg-teal-50 text-teal-700 rounded-md"
              title="Upload surat jadi"
            >
              <Upload size={14} />
            </button>
            {row.file_hasil_url && (
              <a
                href={getUploadUrl(row.file_hasil_url)}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-gray-50 text-gray-600 rounded-md"
                title="Lihat hasil"
              >
                <FileText size={14} />
              </a>
            )}
            <button
              onClick={() => handleSelesai(id, row)}
              className="flex items-center gap-0.5 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md"
            >
              <Check size={12} /> Selesai
            </button>
            <button
              onClick={() => handleRevisi(id)}
              className="p-1.5 bg-amber-50 text-amber-700 rounded-md"
              title="Minta revisi"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => handleTolak(id)}
              className="p-1.5 bg-red-50 text-red-700 rounded-md"
            >
              <X size={14} />
            </button>
          </div>
        );
      },
    },
  ];

  const panelClass = 'bg-white rounded-xl shadow-md p-6 border border-gray-100';

  return (
    <MainLayout>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={uploadInputRef}
        onChange={handleUploadHasil}
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            <span>✅</span> Persetujuan & Tracking Surat
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola alur status, upload surat jadi, dan permintaan revisi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card icon="⏳" title="Dalam Proses" value={stats.pending} color="yellow" />
          <Card icon="✅" title="Selesai" value={stats.disetujui} color="green" />
          <Card icon="❌" title="Ditolak" value={stats.ditolak} color="red" />
        </div>

        <div className={panelClass}>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari perihal atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 focus:bg-white"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filteredLetters.length > 0 ? (
            <Table columns={columns} data={filteredLetters} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada pengajuan yang perlu diproses saat ini.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
