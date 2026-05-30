import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Button } from '../components';
import { notifikasiService } from '../services';
import { formatDateTime, getUploadUrl } from '../utils';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Info, Download } from 'lucide-react';

function getNotifIcon(pesan) {
  const p = (pesan || '').toLowerCase();
  if (p.includes('tugas akhir') || p.includes('ta')) return { icon: '🎓', color: 'bg-purple-100' };
  if (p.includes('disetujui')) return { icon: '✅', color: 'bg-green-100' };
  if (p.includes('ditolak')) return { icon: '❌', color: 'bg-red-100' };
  if (p.includes('surat') || p.includes('pengajuan baru')) return { icon: '📨', color: 'bg-blue-100' };
  return { icon: '🔔', color: 'bg-gray-100' };
}

export default function Notifikasi() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');

  const loadNotifikasi = async () => {
    setLoading(true);
    try {
      const res = await notifikasiService.getAll();
      setItems(res.data || []);
    } catch (err) {
      console.error('Gagal memuat notifikasi', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifikasi();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notifikasiService.markAllRead();
      await loadNotifikasi();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notifikasiService.markAsRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((n) => {
    if (filter === 'belum') return !n.is_read;
    if (filter === 'dibaca') return n.is_read;
    return true;
  });

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <Bell className="text-blue-600" /> Semua Notifikasi
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Notifikasi real-time dari sistem (pengajuan baru, persetujuan, penolakan)
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="primary" onClick={handleMarkAllRead} className="flex items-center gap-2">
              <CheckCheck size={18} /> Tandai Semua Dibaca ({unreadCount})
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'semua', label: 'Semua' },
            { key: 'belum', label: 'Belum Dibaca' },
            { key: 'dibaca', label: 'Sudah Dibaca' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filtered.map((notif) => {
                const meta = getNotifIcon(notif.pesan);
                const data = notif.metadata || {};
                const downloadUrl = data.file_url ? getUploadUrl(data.file_url) : null;
                return (
                  <li
                    key={notif.id}
                    className={`p-5 flex gap-4 hover:bg-gray-50 transition-colors ${
                      !notif.is_read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${meta.color}`}
                    >
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {notif.pesan}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notif.created_at ? formatDateTime(notif.created_at) : '-'}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {downloadUrl && (
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleMarkRead(notif.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            <Download size={12} /> Download Surat
                          </a>
                        )}
                        {notif.pengajuan_id && (
                          <button
                            type="button"
                            onClick={() => {
                              handleMarkRead(notif.id);
                              navigate(`/riwayat-pengajuan?detail=${notif.pengajuan_id}`);
                            }}
                            className="text-xs text-gray-600 hover:underline"
                          >
                            Lihat tracking
                          </button>
                        )}
                      </div>
                    </div>
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="text-xs font-bold text-blue-600 hover:underline shrink-0 self-center"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Info className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-medium">Tidak ada notifikasi</p>
              <p className="text-sm mt-1">
                Notifikasi muncul saat ada pengajuan baru atau status berubah.
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-bold mb-2">Siapa mendapat notifikasi?</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>
              <strong>Dosen & Admin</strong> — saat mahasiswa mengajukan surat/judul TA
            </li>
            <li>
              <strong>Mahasiswa</strong> — saat dosen/admin menyetujui atau menolak pengajuan
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
