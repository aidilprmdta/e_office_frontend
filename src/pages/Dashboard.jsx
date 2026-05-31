import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts";
import { Card, Table } from "../components";
import { pengajuanService, dosenService, adminService } from "../services";
import { formatDate, isPendingStatus, getStatusLabel, getStatusBadgeClass } from "../utils";
import { useAuth } from "../hooks/useAuth";
import { QRCodeSVG } from "qrcode.react";
import {
  Mail,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Users,
  QrCode,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, role: userRole } = useAuth();
  const effectiveRole = userRole || user?.role || "mahasiswa";
  const displayUser = user || { nama: "Pengguna", role: "mahasiswa" };

  const [stats, setStats] = useState({
    suratMasuk: 0,
    tugasAkhir: 0,
    persetujuanPending: 0,
    totalUser: 0,
  });
  const [recentLetters, setRecentLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([
    { id: 1, text: "Sistem E-Office berhasil diakses", time: "Baru saja", icon: "🌐" },
    { id: 2, text: "Sinkronisasi data dengan server", time: "1 menit lalu", icon: "🔄" },
  ]);

  // State untuk QR modal
  const [qrModal, setQrModal] = useState({ open: false, pengajuan: null });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        let totalSurat = 0;
        let totalTA = 0;
        let pending = 0;
        let totalUsr = 0;
        let recentData = [];

        if (effectiveRole === "mahasiswa") {
          const res = await pengajuanService.getRiwayat();
          const data = res.data || [];
          recentData = data;
          totalSurat = data.filter((i) => i.jenis_pengajuan === "Surat").length;
          totalTA = data.filter((i) => i.jenis_pengajuan === "Tugas Akhir").length;
          pending = data.filter((i) => isPendingStatus(i.status)).length;

          // Update aktivitas sistem dari data nyata
          if (data.length > 0) {
            const latest = data.slice(0, 3).map((item, idx) => ({
              id: idx + 10,
              text: `Pengajuan "${item.judul_perihal?.substring(0, 30)}..." — ${item.status}`,
              time: formatDate(item.created_at),
              icon: item.status === "Pending" ? "⏳" : item.status === "Disetujui" ? "✅" : "❌",
            }));
            setActivities(latest);
          }
        } else if (effectiveRole === "dosen") {
          const res = await dosenService.getPengajuanMasuk();
          const data = res.data || [];
          recentData = data;
          totalSurat = data.filter((i) => i.jenis_pengajuan === "Surat").length;
          totalTA = data.filter((i) => i.jenis_pengajuan === "Tugas Akhir").length;
          pending = data.filter((i) => isPendingStatus(i.status)).length;

          setActivities([
            { id: 1, text: `${pending} pengajuan menunggu persetujuan`, time: "Terkini", icon: "⏳" },
            { id: 2, text: `${totalSurat} pengajuan surat masuk`, time: "Total", icon: "📨" },
            { id: 3, text: `${totalTA} tugas akhir dibimbing`, time: "Total", icon: "🎓" },
          ]);
        } else if (effectiveRole === "admin") {
          const [userRes, dashRes] = await Promise.all([
            adminService.getUsers(),
            adminService.getDashboard(),
          ]);
          const userData = userRes.data || [];
          const dash = dashRes.data || {};
          totalUsr = userData.length;
          totalSurat = dash.total_pengajuan || 0;
          pending = dash.total_pending || 0;
          totalTA = dash.total_disetujui || 0;

          setActivities([
            { id: 1, text: `${dash.total_pengajuan ?? 0} total pengajuan di sistem`, time: "Terkini", icon: "📋" },
            { id: 2, text: `${dash.total_pending ?? 0} pengajuan menunggu`, time: "Perlu aksi", icon: "⏳" },
            { id: 3, text: `${dash.total_disetujui ?? 0} disetujui, ${dash.total_ditolak ?? 0} ditolak`, time: "Statistik", icon: "📊" },
          ]);
        }

        setStats({ suratMasuk: totalSurat, tugasAkhir: totalTA, persetujuanPending: pending, totalUser: totalUsr });
        setRecentLetters(recentData.slice(0, 5));
      } catch (error) {
        console.warn("Gagal memuat data dashboard:", error.message);
        setActivities([
          { id: 1, text: "Sistem E-Office aktif", time: "Baru saja", icon: "🌐" },
          { id: 2, text: "Koneksi ke server terjalin", time: "Online", icon: "✅" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [effectiveRole, user, userRole]);

  const { statCards, quickActions, tableColumns } = useMemo(() => {
    let cards;
    let actions;
    let columns;

  if (effectiveRole === "dosen") {
    cards = [
      { icon: <Mail size={24} />, title: "Pengajuan Surat", value: stats.suratMasuk, color: "blue", trend: "Bulan Ini" },
      { icon: <AlertCircle size={24} />, title: "Perlu Persetujuan", value: stats.persetujuanPending, color: "yellow", trend: "Status Pending" },
      { icon: <BookOpen size={24} />, title: "TA Dibimbing", value: stats.tugasAkhir, color: "purple", trend: "Mahasiswa Bimbingan" },
    ];
    actions = [
      { icon: <Mail size={20} />, label: "Lihat Pengajuan Masuk", color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200", action: () => navigate("/persetujuan") },
      { icon: <BookOpen size={20} />, label: "Daftar Judul TA", color: "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200", action: () => navigate("/tugas-akhir") },
    ];
    columns = [
      { key: "jenis_pengajuan", label: "Jenis" },
      { key: "judul_perihal", label: "Judul/Perihal" },
      { key: "status", label: "Status" },
    ];
  } else if (effectiveRole === "admin") {
      cards = [
        { icon: <Users size={24} />, title: "Total User", value: stats.totalUser, color: "green", trend: "Mahasiswa & Dosen" },
        { icon: <Mail size={24} />, title: "Total Pengajuan", value: stats.suratMasuk, color: "blue", trend: "Surat & TA" },
        { icon: <AlertCircle size={24} />, title: "Pending", value: stats.persetujuanPending, color: "yellow", trend: "Menunggu Aksi" },
        { icon: <BookOpen size={24} />, title: "Disetujui", value: stats.tugasAkhir, color: "purple", trend: "Total Disetujui" },
      ];
      actions = [
        { icon: <Users size={20} />, label: "Manajemen User", color: "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200", action: () => navigate("/users") },
        { icon: <Mail size={20} />, label: "Lihat Semua Pengajuan", color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200", action: () => navigate("/surat-masuk") },
      ];
      columns = [
        { key: "username", label: "Username" },
        { key: "nama", label: "Nama" },
        { key: "role", label: "Role" },
      ];
    } else {
      // MAHASISWA
      cards = [
        { icon: <Mail size={24} />, title: "Pengajuan Surat", value: stats.suratMasuk, color: "blue", trend: "Total Pengajuan" },
        { icon: <BookOpen size={24} />, title: "Judul TA", value: stats.tugasAkhir, color: "purple", trend: "Judul Diajukan" },
        { icon: <AlertCircle size={24} />, title: "Status Pending", value: stats.persetujuanPending, color: "yellow", trend: "Menunggu Persetujuan" },
      ];
      actions = [
        { icon: <Mail size={20} />, label: "Buat Pengajuan Surat", color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200", action: () => navigate("/pengajuan") },
        { icon: <BookOpen size={20} />, label: "Daftar Judul Tugas Akhir", color: "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200", action: () => navigate("/tugas-akhir") },
        { icon: <TrendingUp size={20} />, label: "Riwayat Pengajuan", color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-yellow-200", action: () => navigate("/riwayat-pengajuan") },
      ];
      columns = [
        { key: "created_at", label: "Tanggal", render: (date) => formatDate(date) },
        { key: "jenis_pengajuan", label: "Jenis" },
        { key: "judul_perihal", label: "Judul/Perihal" },
        // ✅ SESUDAH
{ key: "status", label: "Status", render: (s) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(s)}`}>
    {getStatusLabel(s)}
  </span>
)},
        { key: "id", label: "QR", render: (id, row) => (
          <button
            onClick={() => setQrModal({ open: true, pengajuan: row })}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors"
            title="Lihat QR Surat"
          >
            <QrCode size={14} />
          </button>
        )},
      ];
    }

    return { statCards: cards, quickActions: actions, tableColumns: columns };
  }, [effectiveRole, stats, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // QR value untuk surat yang dipilih
  const qrValue = qrModal.pengajuan
    ? `${window.location.origin}/verifikasi?kode=EO-${String(qrModal.pengajuan.id).padStart(4, "0")}-${qrModal.pengajuan.mahasiswa_id || "0"}`
    : "";

  return (
    <MainLayout>
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen opacity-10 translate-x-20 -translate-y-20"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                Selamat Datang, {displayUser.nama}! 👋
              </h1>
              <p className="text-blue-100 text-base md:text-lg">
                Hak Akses Anda:{" "}
                <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-sm">
                  {effectiveRole}
                </span>
              </p>
              <div className="flex gap-4 mt-4 text-blue-100 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Sistem Online</span>
                </div>
              </div>
            </div>
            <div className="text-5xl md:text-6xl drop-shadow-md hidden md:block">📬</div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <Card key={idx} icon={stat.icon} title={stat.title} value={loading ? "..." : stat.value} color={stat.color} trend={stat.trend} />
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚡</span> Navigasi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className={`${action.color} rounded-lg p-5 font-bold flex items-center justify-between transition-all duration-200 group cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  {action.icon}
                  <span>{action.label}</span>
                </div>
                <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Table + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Mail size={22} className="text-blue-600" /> Data Terbaru
              </h2>
              {effectiveRole === "mahasiswa" && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <QrCode size={12} /> Klik ikon QR untuk lihat kode surat
                </span>
              )}
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : recentLetters.length > 0 ? (
                <Table columns={tableColumns} data={recentLetters} />
              ) : (
                <div className="text-center py-8 text-gray-500">Belum ada data terbaru.</div>
              )}
            </div>
          </motion.div>

          {/* Aktivitas Sistem — update dari data nyata */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📊 Update Sistem Terbaru
            </h2>
            <div className="space-y-4">
              {activities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="border-l-2 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold text-sm">{activity.text}</p>
                      <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrModal.open && qrModal.pengajuan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setQrModal({ open: false, pengajuan: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <QrCode size={20} className="text-blue-600" /> Kode QR Surat
                </h3>
                <button
                  onClick={() => setQrModal({ open: false, pengajuan: null })}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 inline-block">
                  <QRCodeSVG value={qrValue} size={180} level="M" />
                </div>
                <div className="text-left space-y-1 text-sm">
                  <p className="font-semibold text-gray-700">{qrModal.pengajuan.judul_perihal}</p>
                  <p className="text-gray-500">{qrModal.pengajuan.jenis_pengajuan} · {qrModal.pengajuan.status}</p>
                  <p className="text-xs text-gray-400 font-mono mt-2 break-all">{qrValue}</p>
                </div>
                <p className="text-xs text-gray-400">
                  Tunjukkan QR ini kepada pihak yang ingin memverifikasi keaslian surat Anda.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
