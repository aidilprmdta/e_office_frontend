import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Table, Button, PengajuanTimeline } from '../components';
import { Search, Plus, Eye, Trash2, X, FileText, Edit3, UploadCloud, Download, ShieldCheck, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  formatDate,
  normalizeStatus,
  canDeletePengajuan,
  isRevisiStatus,
  getStatusLabel,
  getStatusBadgeClass,
  getUploadUrl,
} from '../utils';
import { pengajuanService } from '../services';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function RiwayatPengajuan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRevisiModal, setShowRevisiModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const fileInputRef = useRef(null);
  const revisiFileRef = useRef(null);

  const [formData, setFormData] = useState({
    judul_perihal: '',
    jenis_pengajuan: 'Surat',
    kategori: 'Surat Aktif Kuliah',
    deskripsi: '',
    file: null,
  });

  const [revisiForm, setRevisiForm] = useState({
    judul_perihal: '',
    kategori: '',
    deskripsi: '',
    file: null,
  });

  const loadLetters = async () => {
    setLoading(true);
    try {
      const response = await pengajuanService.getRiwayat();
      setLetters(response.data || []);
    } catch (err) {
      console.warn('Gagal memuat data dari API.', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTracking = async (id) => {
    setTrackingLoading(true);
    try {
      const res = await pengajuanService.getTracking(id);
      setTracking(res.data);
    } catch {
      setTracking(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const openDetail = async (letter) => {
    setSelectedLetter(letter);
    setShowDetailModal(true);
    await loadTracking(letter.id);
  };

  useEffect(() => {
    loadLetters();
  }, []);

  useEffect(() => {
    const detailId = searchParams.get('detail');
    if (!detailId || letters.length === 0) return;
    const letter = letters.find((l) => String(l.id) === detailId);
    if (!letter) return;
    setSelectedLetter(letter);
    setShowDetailModal(true);
    loadTracking(letter.id);
    setSearchParams({}, { replace: true });
  }, [letters, searchParams, setSearchParams]);

  const handleFileChange = (e, isRevisi = false) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      Swal.fire('Format Salah!', 'Harap unggah file berformat PDF.', 'warning');
      e.target.value = null;
      return;
    }
    if (isRevisi) setRevisiForm({ ...revisiForm, file: selectedFile });
    else setFormData({ ...formData, file: selectedFile });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      Swal.fire('File Kosong', 'Anda wajib mengunggah file dokumen lampiran (PDF).', 'warning');
      return;
    }
    try {
      const submitData = new FormData();
      submitData.append('judul_perihal', formData.judul_perihal);
      submitData.append('jenis_pengajuan', formData.jenis_pengajuan);
      submitData.append('kategori', formData.kategori);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('file', formData.file);
      await pengajuanService.create(submitData);
      Swal.fire('Berhasil!', 'Pengajuan berhasil dikirim.', 'success');
      setShowCreateModal(false);
      setFormData({
        judul_perihal: '',
        jenis_pengajuan: 'Surat',
        kategori: 'Surat Aktif Kuliah',
        deskripsi: '',
        file: null,
      });
      loadLetters();
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.detail || 'Terjadi kesalahan saat mengunggah.', 'error');
    }
  };

  const handleRevisiSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLetter) return;
    try {
      const submitData = new FormData();
      submitData.append('judul_perihal', revisiForm.judul_perihal);
      submitData.append('kategori', revisiForm.kategori);
      submitData.append('deskripsi', revisiForm.deskripsi);
      if (revisiForm.file) submitData.append('file', revisiForm.file);
      await pengajuanService.kirimRevisi(selectedLetter.id, submitData);
      Swal.fire('Berhasil!', 'Revisi telah dikirim ulang.', 'success');
      setShowRevisiModal(false);
      setShowDetailModal(false);
      loadLetters();
    } catch (err) {
      const detail = err.response?.data?.detail;
      Swal.fire('Gagal', typeof detail === 'string' ? detail : 'Gagal mengirim revisi.', 'error');
    }
  };

  const handleDelete = async (id, status) => {
    if (!canDeletePengajuan(status)) {
      Swal.fire('Ditolak', 'Pengajuan ini tidak dapat dibatalkan.', 'error');
      return;
    }
    const result = await Swal.fire({
      title: 'Batalkan Pengajuan?',
      text: 'Pengajuan yang dibatalkan akan dihapus dari sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonText: 'Kembali',
      confirmButtonText: 'Ya, Batalkan!',
    });
    if (result.isConfirmed) {
      try {
        await pengajuanService.delete(id);
        Swal.fire('Dibatalkan!', 'Pengajuan berhasil dihapus.', 'success');
        loadLetters();
      } catch (err) {
        Swal.fire('Gagal', err.response?.data?.detail || 'Tidak dapat membatalkan.', 'error');
      }
    }
  };

  const openRevisi = (letter) => {
    setSelectedLetter(letter);
    setRevisiForm({
      judul_perihal: letter.judul_perihal || '',
      kategori: letter.kategori || '',
      deskripsi: letter.deskripsi || '',
      file: null,
    });
    setShowRevisiModal(true);
  };

  const filteredLetters = letters.filter((letter) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      (letter.judul_perihal || '').toLowerCase().includes(s) ||
      (letter.kategori || '').toLowerCase().includes(s);
    const matchStatus =
      filterStatus === 'semua' || normalizeStatus(letter.status) === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      key: 'created_at',
      label: 'Tanggal Diajukan',
      render: (date) => <span className="font-medium text-gray-700">{formatDate(date)}</span>,
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
    { key: 'kategori', label: 'Kategori' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(status)}`}>
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Aksi',
      render: (id, row) => (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => openDetail(row)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md"
            title="Lihat Detail & Tracking"
          >
            <Eye size={16} />
          </button>
          {isRevisiStatus(row.status) && (
            <button
              onClick={() => openRevisi(row)}
              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md"
              title="Edit / Revisi"
            >
              <Edit3 size={16} />
            </button>
          )}
          {canDeletePengajuan(row.status) && (
            <button
              onClick={() => handleDelete(row.id, row.status)}
              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md"
              title="Batalkan"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const panelClass = 'bg-white rounded-xl shadow-md p-6 border border-gray-100';
  const inputClass =
    'w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 focus:bg-white';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <span>📤</span> Riwayat Pengajuan
            </h1>
            <p className="text-gray-600 mt-1">
              Pantau timeline status surat dan tugas akhir Anda
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} /> Buat Pengajuan Baru
          </Button>
        </div>

        <div className={panelClass}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari perihal atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClass + ' pl-10'}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={inputClass + ' md:w-56'}
            >
              <option value="semua">Semua Status</option>
              <option value="diajukan">Diajukan</option>
              <option value="diproses_admin">Diproses Admin</option>
              <option value="menunggu_tanda_tangan">Menunggu TTD</option>
              <option value="perlu_revisi">Perlu Revisi</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <div className={panelClass}>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : letters.length > 0 ? (
            <Table columns={columns} data={filteredLetters} />
          ) : (
            <div className="text-center py-8 text-gray-500">Belum ada riwayat pengajuan.</div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <ModalShell onClose={() => setShowCreateModal(false)}>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Edit3 size={22} className="text-blue-600" /> Form Pengajuan Baru
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <FormFields formData={formData} setFormData={setFormData} inputClass={inputClass} />
              <UploadZone
                file={formData.file}
                inputRef={fileInputRef}
                onChange={(e) => handleFileChange(e, false)}
              />
              <ModalActions onCancel={() => setShowCreateModal(false)} submitLabel="Kirim Pengajuan" />
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* REVISI MODAL */}
      <AnimatePresence>
        {showRevisiModal && selectedLetter && (
          <ModalShell onClose={() => setShowRevisiModal(false)}>
            <h3 className="text-xl font-bold text-amber-800 mb-2">Edit / Revisi Pengajuan</h3>
            {selectedLetter.catatan_revisi && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                <strong>Catatan Admin:</strong> {selectedLetter.catatan_revisi}
              </div>
            )}
            <form onSubmit={handleRevisiSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Judul / Perihal</label>
                <input
                  type="text"
                  required
                  value={revisiForm.judul_perihal}
                  onChange={(e) => setRevisiForm({ ...revisiForm, judul_perihal: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  value={revisiForm.kategori}
                  onChange={(e) => setRevisiForm({ ...revisiForm, kategori: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  required
                  value={revisiForm.deskripsi}
                  onChange={(e) => setRevisiForm({ ...revisiForm, deskripsi: e.target.value })}
                  className={inputClass}
                />
              </div>
              <UploadZone
                file={revisiForm.file}
                inputRef={revisiFileRef}
                onChange={(e) => handleFileChange(e, true)}
                optional
              />
              <ModalActions onCancel={() => setShowRevisiModal(false)} submitLabel="Kirim Revisi" />
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* DETAIL + TIMELINE MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedLetter && (
          <ModalShell onClose={() => setShowDetailModal(false)} wide>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FileText className="text-blue-600" size={24} /> Detail & Tracking
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Perihal:</span>{' '}
                  <strong>{selectedLetter.judul_perihal}</strong>
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(selectedLetter.status)}`}>
                    {getStatusLabel(selectedLetter.status)}
                  </span>
                </p>
              </div>

              {selectedLetter.catatan_revisi && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <strong>Catatan Revisi:</strong> {selectedLetter.catatan_revisi}
                </div>
              )}

              {selectedLetter.catatan_dosen && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800">
                  <strong>Catatan:</strong> {selectedLetter.catatan_dosen}
                </div>
              )}

              {normalizeStatus(selectedLetter.status) === 'selesai' && (() => {
                const kodeVerifikasi =
                  selectedLetter.kode_verifikasi || tracking?.kode_verifikasi;
                return (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
                        <ShieldCheck size={18} className="text-green-600" />
                        Kode Verifikasi Surat
                      </h4>
                      {kodeVerifikasi ? (
                        <>
                          <p className="text-xs text-gray-600 mb-2">
                            Gunakan kode ini pada surat fisik atau pindai QR untuk verifikasi keaslian.
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <code className="px-3 py-2 bg-white border border-blue-200 rounded-lg font-mono text-sm font-bold text-blue-900">
                              {kodeVerifikasi}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(kodeVerifikasi);
                                Swal.fire({
                                  toast: true,
                                  position: 'top-end',
                                  icon: 'success',
                                  title: 'Kode disalin',
                                  showConfirmButton: false,
                                  timer: 1500,
                                });
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
                            >
                              <Copy size={14} /> Salin
                            </button>
                            <Link
                              to={`/verifikasi?kode=${kodeVerifikasi}`}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              Buka halaman verifikasi →
                            </Link>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Kode verifikasi sedang diproses. Refresh halaman setelah beberapa saat.
                        </p>
                      )}
                    </div>
                    {kodeVerifikasi && (
                      <div className="shrink-0 flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                        <QRCodeSVG
                          value={`${window.location.origin}/verifikasi?kode=${kodeVerifikasi}`}
                          size={112}
                          level="M"
                        />
                        <span className="text-[10px] text-gray-500">Scan untuk verifikasi</span>
                      </div>
                    )}
                  </div>
                </div>
                );
              })()}

              <div>
                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                  Progress Surat
                </h4>
                {trackingLoading ? (
                  <p className="text-sm text-gray-500">Memuat timeline...</p>
                ) : (
                  <PengajuanTimeline
                    status={tracking?.status_saat_ini || selectedLetter.status}
                    timeline={tracking?.timeline || []}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedLetter.file_url && (
                  <a
                    href={getUploadUrl(selectedLetter.file_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                  >
                    <FileText size={16} /> Lampiran Pengajuan
                  </a>
                )}
                {(selectedLetter.file_hasil_url || tracking?.file_hasil_url) && (
                  <a
                    href={getUploadUrl(selectedLetter.file_hasil_url || tracking?.file_hasil_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:underline"
                  >
                    <Download size={16} /> Download Surat Jadi
                  </a>
                )}
              </div>

              {isRevisiStatus(selectedLetter.status) && (
                <Button variant="primary" onClick={() => { setShowDetailModal(false); openRevisi(selectedLetter); }}>
                  <Edit3 size={18} /> Edit / Revisi
                </Button>
              )}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Tutup</Button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

function ModalShell({ children, onClose, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-2xl w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto border border-gray-100 ${wide ? 'max-w-2xl' : 'max-w-xl'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full text-gray-400"
        >
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </div>
  );
}

function FormFields({ formData, setFormData, inputClass }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Jenis Pengajuan</label>
          <select
            value={formData.jenis_pengajuan}
            onChange={(e) => setFormData({ ...formData, jenis_pengajuan: e.target.value })}
            className={inputClass}
          >
            <option value="Surat">Administrasi Surat</option>
            <option value="Tugas Akhir">Tugas Akhir (TA)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Kategori</label>
          <input
            type="text"
            required
            value={formData.kategori}
            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Judul / Perihal</label>
        <input
          type="text"
          required
          value={formData.judul_perihal}
          onChange={(e) => setFormData({ ...formData, judul_perihal: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Deskripsi</label>
        <textarea
          rows={3}
          required
          value={formData.deskripsi}
          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          className={inputClass}
        />
      </div>
    </>
  );
}

function UploadZone({ file, inputRef, onChange, optional }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        Unggah Dokumen (PDF){optional ? ' — opsional' : ''}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-blue-300 rounded-xl p-6 flex flex-col items-center bg-blue-50 hover:bg-blue-100 cursor-pointer"
      >
        <UploadCloud size={32} className="text-blue-500 mb-2" />
        <p className="text-sm font-bold text-blue-700">
          {file ? file.name : 'Klik untuk memilih file PDF'}
        </p>
        <input type="file" accept=".pdf" className="hidden" ref={inputRef} onChange={onChange} />
      </div>
    </div>
  );
}

function ModalActions({ onCancel, submitLabel }) {
  return (
    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
      <Button variant="secondary" type="button" onClick={onCancel}>Batal</Button>
      <Button variant="primary" type="submit">{submitLabel}</Button>
    </div>
  );
}
