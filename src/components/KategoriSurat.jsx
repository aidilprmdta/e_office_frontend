import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Mail,
  ScrollText,
  ClipboardCheck,
  BadgeCheck,
  FileCheck,
  GraduationCap,
  DoorOpen,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  X,
  User,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../services';

/* ── Icon & colour mapping for known categories ───────────────────── */
const CATEGORY_META = {
  'surat aktif kuliah': {
    icon: GraduationCap,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    bar: 'bg-blue-500',
    emoji: '🎓',
  },
  'surat izin masuk': {
    icon: DoorOpen,
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    bar: 'bg-green-500',
    emoji: '🚪',
  },
  'surat keterangan lulus': {
    icon: BadgeCheck,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    bar: 'bg-violet-500',
    emoji: '🏆',
  },
  'surat pengantar': {
    icon: Mail,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
    emoji: '✉️',
  },
  'surat rekomendasi': {
    icon: ClipboardCheck,
    gradient: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    bar: 'bg-cyan-500',
    emoji: '📋',
  },
  'surat tugas': {
    icon: FileCheck,
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    bar: 'bg-rose-500',
    emoji: '📝',
  },
};

const FALLBACK = {
  icon: FolderOpen,
  gradient: 'from-slate-500 to-gray-600',
  bg: 'bg-slate-50',
  text: 'text-slate-700',
  border: 'border-slate-200',
  bar: 'bg-slate-500',
  emoji: '📂',
};

const getMeta = (kategori) => {
  const key = (kategori || '').toLowerCase().trim();
  for (const [name, meta] of Object.entries(CATEGORY_META)) {
    if (key.includes(name) || name.includes(key)) return meta;
  }
  if (key.includes('aktif')) return CATEGORY_META['surat aktif kuliah'];
  if (key.includes('izin')) return CATEGORY_META['surat izin masuk'];
  if (key.includes('lulus')) return CATEGORY_META['surat keterangan lulus'];
  if (key.includes('pengantar')) return CATEGORY_META['surat pengantar'];
  if (key.includes('rekomendasi')) return CATEGORY_META['surat rekomendasi'];
  if (key.includes('tugas')) return CATEGORY_META['surat tugas'];
  return FALLBACK;
};

/* ── Status badge helper ──────────────────────────────────────────── */
const StatusBadge = ({ status, count }) => {
  const s = (status || '').toLowerCase();
  const config = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' },
    diajukan: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Diajukan' },
    disetujui: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Disetujui' },
    ditolak: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Ditolak' },
    'perlu revisi': { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Revisi' },
  };
  const c = config[s] || config.pending;
  const Icon = c.icon;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${c.bg} ${c.border}`}>
      <Icon size={12} className={c.color} />
      <span className={`text-xs font-bold ${c.color}`}>{count}</span>
      <span className="text-[10px] text-gray-500">{c.label}</span>
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────────── */
export default function KategoriSurat() {
  const [kategori, setKategori] = useState([]);
  const [totalSurat, setTotalSurat] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [detailData, setDetailData] = useState({});
  const [detailLoading, setDetailLoading] = useState({});

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await adminService.getKategoriSurat(24);
      const d = res.data || {};
      const list = d.kategori_list || [];
      setKategori(list);
      setTotalSurat(d.total_surat || 0);
      setTotalKategori(d.total_kategori || 0);
      // Pre-populate detailData from the full list
      const map = {};
      list.forEach((k) => { map[k.kategori] = k; });
      setDetailData(map);
    } catch {
      // Fallback to analytics endpoint
      try {
        const res = await adminService.getAnalytics(24);
        const d = res.data || {};
        setKategori(
          (d.distribusi_kategori || []).map((k) => ({
            ...k,
            status_breakdown: {},
            surat_terbaru: [],
          }))
        );
        setTotalSurat(d.total_surat_periode || 0);
        setTotalKategori((d.distribusi_kategori || []).length);
      } catch {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const toggleExpand = (kat) => {
    setExpanded(expanded === kat ? null : kat);
  };

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Memuat kategori surat…</span>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <p className="text-sm text-red-500 font-medium">Gagal memuat data kategori surat.</p>
      </div>
    );
  }

  /* ── Empty ───────────────────────────────────────────────────────── */
  if (kategori.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center text-gray-400">
          <ScrollText size={40} className="mb-3 opacity-50" />
          <p className="text-sm font-semibold">Belum Ada Kategori Surat</p>
          <p className="text-xs mt-1">Kategori akan muncul otomatis saat ada surat yang masuk.</p>
        </div>
      </div>
    );
  }

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ScrollText className="text-indigo-600" size={22} />
              Kategori Surat Masuk
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Klasifikasi otomatis berdasarkan surat yang diajukan mahasiswa
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              <FolderOpen size={14} className="text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">{totalKategori} Kategori</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              <FileText size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-blue-700">{totalSurat} Surat Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kategori.map((kat, idx) => {
            const meta = getMeta(kat.kategori);
            const Icon = meta.icon;
            const isExpanded = expanded === kat.kategori;
            const statusBreakdown = kat.status_breakdown || {};
            const suratTerbaru = kat.surat_terbaru || [];

            return (
              <motion.div
                key={kat.kategori}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35 }}
              >
                <div
                  className={`relative rounded-xl border-2 ${meta.border} overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer`}
                  onClick={() => toggleExpand(kat.kategori)}
                >
                  {/* Top colour band */}
                  <div className={`h-1.5 bg-gradient-to-r ${meta.gradient}`} />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-xl ${meta.bg}`}>
                        <Icon size={22} className={meta.text} />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-gray-800">{kat.jumlah}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Surat</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1 capitalize">
                      {kat.kategori}
                    </h3>
                    <p className="text-[11px] text-gray-400 mb-3">
                      {kat.persen}% dari total surat masuk
                    </p>

                    {/* Status mini badges */}
                    {Object.keys(statusBreakdown).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {Object.entries(statusBreakdown).map(([st, cnt]) => (
                          <StatusBadge key={st} status={st} count={cnt} />
                        ))}
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${meta.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(kat.persen, 100)}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.06 }}
                      />
                    </div>

                    {/* Expand indicator */}
                    <div className="flex items-center justify-center mt-3">
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className={`mx-1 mb-1 rounded-b-xl border-2 border-t-0 ${meta.border} ${meta.bg} p-4`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Detail Kategori
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                            className="p-1 hover:bg-white/60 rounded-full transition-colors"
                          >
                            <X size={14} className="text-gray-400" />
                          </button>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-white/70 rounded-lg p-3 text-center">
                            <p className="text-lg font-extrabold text-gray-800">{kat.jumlah}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Total Surat</p>
                          </div>
                          <div className="bg-white/70 rounded-lg p-3 text-center">
                            <p className="text-lg font-extrabold text-gray-800">{kat.persen}%</p>
                            <p className="text-[10px] text-gray-500 font-medium">Persentase</p>
                          </div>
                        </div>

                        {/* Category description */}
                        <div className="bg-white/70 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-base">{meta.emoji}</span>
                            <span className="font-semibold capitalize">{kat.kategori}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                            Kategori ini mencakup {kat.jumlah} surat yang diajukan oleh mahasiswa.
                            Mendominasi {kat.persen}% dari seluruh surat masuk pada periode ini.
                          </p>
                        </div>

                        {/* Recent surat list */}
                        {suratTerbaru.length > 0 && (
                          <div className="bg-white/70 rounded-lg p-3">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                              Surat Terbaru
                            </p>
                            <div className="space-y-2">
                              {suratTerbaru.map((s) => (
                                <div
                                  key={s.id}
                                  className="flex items-start gap-2.5 p-2 rounded-lg bg-white/80 border border-gray-100"
                                >
                                  <div className={`mt-0.5 p-1 rounded-md ${meta.bg}`}>
                                    <FileText size={12} className={meta.text} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-700 truncate">
                                      {s.judul_perihal}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                        <User size={10} />
                                        {s.mahasiswa_nama}
                                      </span>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        s.status === 'Disetujui' ? 'bg-green-100 text-green-700' :
                                        s.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                      }`}>
                                        {s.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {suratTerbaru.length === 0 && (
                          <div className="bg-white/70 rounded-lg p-3 text-center">
                            <p className="text-[11px] text-gray-400">Tidak ada data surat terbaru.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Summary footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">
                {totalKategori} kategori • {totalSurat} surat total
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {kategori.slice(0, 6).map((kat) => {
                const meta = getMeta(kat.kategori);
                return (
                  <div
                    key={kat.kategori}
                    className={`w-3 h-3 rounded-full ${meta.bar}`}
                    title={`${kat.kategori}: ${kat.jumlah} surat`}
                  />
                );
              })}
              {kategori.length > 6 && (
                <span className="text-[10px] text-gray-400 ml-1">+{kategori.length - 6}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
