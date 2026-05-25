import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts";
import { Card, Table, Button } from "../components";
import { suratService, tugasAkhirService } from "../services";
import { formatDate } from "../utils";
import {
  Mail,
  Send,
  BookOpen,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

  // Get logged-in user details
  const userString = localStorage.getItem("user");
  const user = userString
    ? JSON.parse(userString)
    : { nama: "Pengguna", role: "mahasiswa" };
  // Get role
  const userRole = user.role?.toLowerCase() || "mahasiswa";

  // Dummy data for each role
  // Mahasiswa
  const mahasiswaStats = [
    {
      icon: <Mail size={24} />,
      title: "Pengajuan Surat",
      value: 4,
      color: "blue",
      trend: "Total Pengajuan",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Judul TA",
      value: 1,
      color: "purple",
      trend: "Judul Diajukan",
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Status Pending",
      value: 1,
      color: "yellow",
      trend: "Menunggu Persetujuan",
    },
  ];
  const mahasiswaActions = [
    {
      icon: <Mail size={20} />,
      label: "Buat Pengajuan Surat",
      color:
        "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200",
      action: () => navigate("/pengajuan"),
    },
    {
      icon: <BookOpen size={20} />,
      label: "Daftar Judul Tugas Akhir",
      color:
        "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200",
      action: () => navigate("/tugas-akhir"),
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Riwayat Pengajuan",
      color:
        "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-yellow-200",
      action: () => navigate("/riwayat-pengajuan"),
    },
  ];
  const mahasiswaTable = [
    {
      tanggal: "2026-05-23",
      jenis: "Surat",
      judul: "Surat Aktif Kuliah",
      status: "Pending",
      aksi: "Lihat",
    },
    {
      tanggal: "2026-05-20",
      jenis: "Tugas Akhir",
      judul: "Sistem E-Office",
      status: "Disetujui",
      aksi: "Unduh",
    },
    {
      tanggal: "2026-05-18",
      jenis: "Surat",
      judul: "Izin Penelitian",
      status: "Ditolak",
      aksi: "Lihat",
    },
  ];

  // Dosen
  const dosenStats = [
    {
      icon: <Mail size={24} />,
      title: "Pengajuan Masuk",
      value: 7,
      color: "blue",
      trend: "Bulan Ini",
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Perlu Persetujuan",
      value: 2,
      color: "yellow",
      trend: "Status Pending",
    },
    {
      icon: <BookOpen size={24} />,
      title: "TA Dibimbing",
      value: 3,
      color: "purple",
      trend: "Mahasiswa Bimbingan",
    },
  ];
  const dosenActions = [
    {
      icon: <Mail size={20} />,
      label: "Lihat Pengajuan Masuk",
      color:
        "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200",
      action: () => navigate("/persetujuan"),
    },
    {
      icon: <BookOpen size={20} />,
      label: "Daftar Judul TA",
      color:
        "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200",
      action: () => navigate("/tugas-akhir"),
    },
  ];
  const dosenTable = [
    {
      nama: "Ayu Lestari",
      nim: "21012345",
      jenis: "TA",
      judul: "Sistem E-Office",
      status: "Pending",
      aksi: "Lihat",
    },
    {
      nama: "Budi Santoso",
      nim: "21054321",
      jenis: "Surat",
      judul: "Izin Penelitian",
      status: "Disetujui",
      aksi: "Unduh",
    },
  ];

  // Admin
  const adminStats = [
    {
      icon: <Mail size={24} />,
      title: "Total Pengajuan",
      value: 120,
      color: "blue",
      trend: "Surat & TA",
    },
    {
      icon: <Users size={24} />,
      title: "Total User",
      value: 80,
      color: "green",
      trend: "Mahasiswa & Dosen",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Judul TA",
      value: 30,
      color: "purple",
      trend: "Didaftarkan",
    },
    {
      icon: <AlertCircle size={24} />,
      title: "Notifikasi",
      value: 300,
      color: "yellow",
      trend: "Terkirim",
    },
  ];
  const adminActions = [
    {
      icon: <Users size={20} />,
      label: "Manajemen User",
      color:
        "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200",
      action: () => navigate("/users"),
    },
    {
      icon: <Mail size={20} />,
      label: "Lihat Semua Pengajuan",
      color:
        "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200",
      action: () => navigate("/surat-masuk"),
    },
  ];
  const adminTable = [
    {
      nama: "Ayu Lestari",
      role: "mahasiswa",
      email: "ayu@kampus.ac.id",
      status: "Aktif",
      aksi: "Edit",
    },
    {
      nama: "Budi Santoso",
      role: "dosen",
      email: "budi@kampus.ac.id",
      status: "Aktif",
      aksi: "Edit",
    },
  ];

  // Render by role
  let statCards = mahasiswaStats,
    quickActions = mahasiswaActions,
    tableData = mahasiswaTable,
    tableColumns = [];
  if (userRole === "dosen") {
    statCards = dosenStats;
    quickActions = dosenActions;
    tableData = dosenTable;
    tableColumns = [
      { key: "nama", label: "Nama Mahasiswa" },
      { key: "nim", label: "NIM" },
      { key: "jenis", label: "Jenis" },
      { key: "judul", label: "Judul/Perihal" },
      { key: "status", label: "Status" },
      { key: "aksi", label: "Aksi" },
    ];
  } else if (userRole === "admin") {
    statCards = adminStats;
    quickActions = adminActions;
    tableData = adminTable;
    tableColumns = [
      { key: "nama", label: "Nama" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
      { key: "aksi", label: "Aksi" },
    ];
  } else {
    // Mahasiswa
    tableColumns = [
      { key: "tanggal", label: "Tanggal" },
      { key: "jenis", label: "Jenis" },
      { key: "judul", label: "Judul/Perihal" },
      { key: "status", label: "Status" },
      { key: "aksi", label: "Aksi" },
    ];
  }

  const [stats, setStats] = useState({
    suratMasuk: 0,
    suratKeluar: 0,
    tugasAkhir: 0,
    persetujuanPending: 0,
  });

  const [recentLetters, setRecentLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activities] = useState([
    {
      id: 1,
      text: "Surat masuk baru dari Rektorat",
      time: "2 jam lalu",
      icon: "📨",
    },
    {
      id: 2,
      text: "Proposal tugas akhir Anda disetujui",
      time: "5 jam lalu",
      icon: "✅",
    },
    {
      id: 3,
      text: "Jadwal seminar tugas akhir dijadwalkan",
      time: "1 hari lalu",
      icon: "📅",
    },
  ]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch data from backend using Promise.allSettled to prevent one failing request from breaking the whole dashboard
        const [masukRes, keluarRes, taRes] = await Promise.allSettled([
          suratService.getMasuk(1, 10),
          suratService.getKeluar(1, 10),
          tugasAkhirService.getList(1, 10),
        ]);

        let totalMasuk = 0;
        let totalKeluar = 0;
        let totalTA = 0;
        let pendingPersetujuan = 0;
        let lettersList = [];

        // Parse Surat Masuk
        if (masukRes.status === "fulfilled") {
          const resData = masukRes.value.data;
          const dataList = resData.data || resData || [];
          totalMasuk = resData.total || dataList.length || 0;
          lettersList = dataList;
          // Count pending approval letters
          pendingPersetujuan = dataList.filter(
            (l) => l.status?.toLowerCase() === "pending",
          ).length;
        }

        // Parse Surat Keluar
        if (keluarRes.status === "fulfilled") {
          const resData = keluarRes.value.data;
          const dataList = resData.data || resData || [];
          totalKeluar = resData.total || dataList.length || 0;
        }

        // Parse Tugas Akhir
        if (taRes.status === "fulfilled") {
          const resData = taRes.value.data;
          const dataList = resData.data || resData || [];
          totalTA = resData.total || dataList.length || 0;
        }

        // If backend returns empty lists, use some placeholder numbers for demo aesthetic
        if (totalMasuk === 0 && totalKeluar === 0 && totalTA === 0) {
          throw new Error("No data, fall back to mock data");
        }

        setStats({
          suratMasuk: totalMasuk,
          suratKeluar: totalKeluar,
          tugasAkhir: totalTA,
          persetujuanPending: pendingPersetujuan,
        });
        setRecentLetters(lettersList.slice(0, 3));
      } catch (error) {
        console.warn(
          "Using mock data for dashboard. Backend is likely offline or unpopulated.",
        );
        // Fallback demo data
        setStats({
          suratMasuk: 8,
          suratKeluar: 5,
          tugasAkhir: 3,
          persetujuanPending: 2,
        });
        setRecentLetters([
          {
            id: 1,
            nomorSurat: "0001/2024/03/20",
            pengirim: "Rektorat",
            perihal: "Pengumuman Akademik Semester Genap",
            tanggal: "2026-05-23",
            status: "Pending",
          },
          {
            id: 2,
            nomorSurat: "0002/2024/03/19",
            pengirim: "Dekanat Fakultas Teknik",
            perihal: "Persetujuan Dana Riset Mandiri",
            tanggal: "2026-05-22",
            status: "Disetujui",
          },
          {
            id: 3,
            nomorSurat: "0003/2024/03/18",
            pengirim: "Bagian Administrasi Akademik",
            perihal: "Surat Pengantar Magang MBKM",
            tanggal: "2026-05-20",
            status: "Disetujui",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen opacity-10 translate-x-20 -translate-y-20"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                Selamat Datang, {user.nama}! 👋
              </h1>
              <p className="text-blue-100 text-base md:text-lg">
                Hak Akses Anda:{" "}
                <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-sm">
                  {userRole}
                </span>
              </p>
              <div className="flex gap-4 mt-4 text-blue-200 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Sistem Online</span>
                </div>
              </div>
            </div>
            <div className="text-5xl md:text-6xl drop-shadow-md hidden md:block">
              📬
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statCards.map((stat, idx) => (
            <Card
              key={idx}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
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
                <ArrowRight
                  size={18}
                  className="opacity-70 group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Letters - Wider */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Mail size={22} className="text-blue-600" />
                Surat Masuk Terbaru
              </h2>
              <button
                onClick={() => navigate("/surat-masuk")}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-sm transition-colors"
              >
                Lihat Semua <ArrowRight size={16} />
              </button>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <Table columns={tableColumns} data={tableData} />
              )}
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📊 Aktivitas Terbaru
              </h2>
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className="border-l-2 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold text-sm">
                          {activity.text}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate("/surat-masuk")}
              className="w-full mt-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 font-bold transition-all duration-200"
            >
              Lihat Semua Aktivitas
            </button>
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Tips Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
              💡 Panduan Singkat
            </h3>
            <ul className="space-y-2.5 text-sm text-amber-800">
              <li className="flex gap-2">
                <span className="font-bold">✓</span>
                <span>
                  Role <strong>Dosen</strong> dan <strong>Admin</strong>{" "}
                  memiliki akses ke menu <strong>Persetujuan Surat</strong>.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">✓</span>
                <span>
                  Hanya role <strong>Admin</strong> yang dapat mengelola
                  pengguna di menu <strong>Manajemen User</strong>.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">✓</span>
                <span>
                  Untuk melakukan pengujian offline, gunakan tombol{" "}
                  <strong>Bypass</strong> di halaman masuk.
                </span>
              </li>
            </ul>
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                🆘 Layanan Bantuan
              </h3>
              <p className="text-sm text-blue-800">
                Mengalami kendala teknis atau masalah sinkronisasi dengan
                database backend? Hubungi unit IT Helpdesk kampus.
              </p>
            </div>
            <a
              href="mailto:admin@kampus.ac.id"
              className="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors mt-4 block"
            >
              Email Administrator
            </a>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
