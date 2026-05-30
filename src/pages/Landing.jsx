import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  Users,
  Mail,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Bell,
  CheckCircle,
  Clock,
  Send,
  Download,
  ChevronRight,
  Menu,
  X,
  Phone,
  UserPlus,
  Award,
  TrendingUp,
  Zap,
  Search,
  MessageSquare,
  HelpCircle,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [activeGuideTab, setActiveGuideTab] = useState("mahasiswa");
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [helpForm, setHelpForm] = useState({
    nama: "",
    email: "",
    kategori: "Akun",
    pesan: "",
  });

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      q: "Bagaimana cara mendaftar akun baru?",
      a: "Anda dapat mendaftar dengan memilih tombol 'Daftar' di pojok kanan atas atau tab 'Register' di halaman masuk. Lengkapi nama lengkap, username/NIM/NIDN, password minimal 6 karakter, dan pilih role Anda (Mahasiswa/Dosen/Admin).",
    },
    {
      q: "Berapa batas ukuran berkas yang bisa diunggah?",
      a: "Batas maksimal ukuran berkas unggahan untuk pengajuan surat maupun tugas akhir adalah 5 Megabyte (5MB) dengan format dokumen .pdf, .doc, atau .docx.",
    },
    {
      q: "Bagaimana cara mengetahui surat saya sudah disetujui?",
      a: "Anda akan mendapatkan notifikasi real-time di bel notifikasi sistem. Status pengajuan Anda pada menu 'Riwayat Pengajuan' juga akan berubah secara instan beserta catatan dosen pembimbing jika ada.",
    },
    {
      q: "Apakah saya bisa membatalkan pengajuan yang salah?",
      a: "Ya, Anda dapat menghapus pengajuan yang masih berstatus diajukan atau perlu revisi. Jika sudah diproses admin, hubungi dosen atau administrator.",
    },
    {
      q: "Mengapa saya tidak bisa melakukan login setelah mendaftar?",
      a: "Pastikan Anda memilih 'Role' yang sesuai (Mahasiswa/Dosen/Admin) saat melakukan login. Username/NIM yang dimasukkan juga harus sama persis dengan yang didaftarkan.",
    },
  ];

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (!helpForm.nama || !helpForm.email || !helpForm.pesan) {
      Swal.fire({
        title: "Formulir Belum Lengkap",
        text: "Mohon lengkapi semua bidang pada formulir pesan.",
        icon: "warning",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }
    
    Swal.fire({
      title: "Pesan Terkirim!",
      text: "Terima kasih atas laporan Anda. Tim dukungan akademik kami akan segera menghubungi Anda melalui email dalam waktu 1x24 jam.",
      icon: "success",
      confirmButtonColor: "#3B82F6",
    });

    setHelpForm({ nama: "", email: "", kategori: "Akun", pesan: "" });
    setActiveModal(null);
  };

  const features = [
    {
      icon: FileText,
      title: "Pengajuan Surat Online",
      description:
        "Ajukan berbagai surat akademik (aktif kuliah, izin penelitian, rekomendasi, dll) secara digital 24/7",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Pendaftaran Judul TA",
      description:
        "Daftarkan judul Tugas Akhir, upload proposal, dan lacak proses persetujuan dosen pembimbing",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Bell,
      title: "Notifikasi Real-time",
      description:
        "Dapatkan notifikasi status pengajuan, revisi, dan persetujuan langsung via dashboard",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Users,
      title: "Manajemen Multi-role",
      description:
        "Akses sesuai role: Mahasiswa, Dosen, Staff, dan Admin dengan fitur yang disesuaikan",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: ShieldCheck,
      title: "Keamanan Terjamin",
      description:
        "Sistem keamanan dengan JWT, enkripsi data, dan perlindungan terhadap akses tidak sah",
      color: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: TrendingUp,
      title: "Laporan & Analitik",
      description:
        "Dashboard analitik untuk melihat statistik pengajuan, trending, dan performa sistem",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const statistics = [
    {
      number: "1,200+",
      label: "Total Pengajuan",
      icon: FileText,
      trend: "+23%",
    },
    { number: "350+", label: "Akun Terdaftar", icon: Users, trend: "+15%" },
    {
      number: "200+",
      label: "Judul TA Terdaftar",
      icon: BookOpen,
      trend: "+32%",
    },
    {
      number: "3,000+",
      label: "Notifikasi Terkirim",
      icon: Bell,
      trend: "+45%",
    },
    { number: "98%", label: "Kepuasan Pengguna", icon: Award, trend: "+5%" },
    { number: "24/7", label: "Layanan Aktif", icon: Zap, trend: "Always" },
  ];

  const benefits = [
    {
      title: "Menghemat Waktu",
      description:
        "Mahasiswa tidak perlu datang ke kampus hanya untuk mengajukan surat atau memantau status pengajuan.",
    },
    {
      title: "Proses Lebih Cepat",
      description:
        "Pengajuan surat dan tugas akhir dapat diproses secara digital dengan alur yang terstruktur.",
    },
    {
      title: "Transparansi Status",
      description:
        "Pengguna dapat memantau status pengajuan secara real-time tanpa harus bertanya ke bagian administrasi.",
    },
    {
      title: "Akses Kapan Saja",
      description:
        "Sistem dapat digunakan 24 jam sehari dari mana saja melalui perangkat yang terhubung internet.",
    },
    {
      title: "Mengurangi Penggunaan Kertas",
      description:
        "Seluruh proses administrasi dilakukan secara digital sehingga lebih ramah lingkungan.",
    },
    {
      title: "Dokumen Tersimpan Aman",
      description:
        "Data dan dokumen tersimpan secara terpusat sehingga lebih mudah dikelola dan dicari kembali.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Registrasi Akun",
      description: "Daftar dengan NIM/NIP dan verifikasi email",
      icon: UserPlus,
    },
    {
      number: "02",
      title: "Ajukan Permohonan",
      description: "Pilih jenis surat/TA dan upload dokumen",
      icon: Send,
    },
    {
      number: "03",
      title: "Proses Verifikasi",
      description: "Petugas/Dosen akan memverifikasi pengajuan",
      icon: Clock,
    },
    {
      number: "04",
      title: "Selesai & Download",
      description: "Dapatkan surat digital & unduh dokumen",
      icon: Download,
    },
  ];

  const newsAndUpdates = [
    {
      title: "Workflow Surat v2.0",
      icon: FileText,
      updates: [
        "Status lengkap: diajukan → dalam proses → revisi → selesai / ditolak",
        "Timeline visual 4 tahap di riwayat pengajuan",
        "Upload berkas PDF/DOC (maks. 5 MB) & unduh surat jadi",
        "Catatan revisi dari dosen jika pengajuan perlu perbaikan",
      ],
      desc: "Alur persuratan akademik lebih transparan dan terlacak.",
    },
    {
      title: "Tugas Akhir Digital",
      icon: BookOpen,
      updates: [
        "Pengajuan judul TA & upload proposal dalam satu formulir",
        "Evaluasi & persetujuan dosen pembimbing dari dashboard",
        "Lampiran abstrak/proposal dapat di-preview langsung",
        "Riwayat status pengajuan TA tersimpan di sistem",
      ],
      desc: "Manajemen tugas akhir terintegrasi dengan modul surat.",
    },
    {
      title: "Pusat Notifikasi",
      icon: Bell,
      updates: [
        "Notifikasi in-app real-time (ikon bell di navbar)",
        "Badge jumlah belum dibaca & tandai semua sudah dibaca",
        "Tipe notifikasi: status update, revisi, surat selesai",
        "Kolom email & no. HP user siap untuk integrasi WA/Email",
      ],
      desc: "Mahasiswa dan dosen selalu mendapat kabar terbaru tanpa cek manual.",
    },
    {
      title: "Fitur Baru v2.0",
      icon: Zap,
      updates: [
        "Dashboard statistik: total pengajuan, pending, disetujui, ditolak",
        "Manajemen user (mahasiswa, dosen, admin) via control panel",
        "Autentikasi JWT & role-based access di seluruh modul",
        "API FastAPI + dokumentasi Swagger di /docs",
      ],
      desc: "Pembaruan sistem — Mei 2026.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col font-sans">
      {/* Header/Navbar dengan efek blur */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl text-white shadow-lg">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              E-Office <span className="text-blue-600">Kampus</span>
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-gray-700 font-semibold text-sm">
            {[
              "cara kerja",
              "fitur",
              "statistik",
              "Manfaat",
              "Update",
              "tentang",
              "Footer",
            ].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="hover:text-blue-600 transition-colors duration-200 capitalize"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-3 items-center">
            <Link
              to="/verifikasi"
              className="px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Verifikasi Surat
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl font-bold bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transition-all duration-300"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="flex flex-col p-4 gap-3">
              {[
                "cara kerja",
                "fitur",
                "statistik",
                "Manfaat",
                "Update",
                "tentang",
                "Footer",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition capitalize"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-3 pt-3">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2 rounded-xl font-bold border-2 border-blue-600 text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2 rounded-xl font-bold bg-blue-600 text-white"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-transparent"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-left"
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Sistem Terintegrasi
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Mudahkan{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Pengajuan Surat
                </span>{" "}
                & Tugas Akhir
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                E-Office Kampus adalah platform digital untuk memproses
                pengajuan surat, pendaftaran judul Tugas Akhir, dan manajemen
                dokumen akademik secara cepat, aman, dan transparan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Mulai Sekarang
                  <ArrowRight className="inline ml-2 w-4 h-4" />
                </Link>
                <a
                  href="#fitur"
                  className="px-8 py-3.5 rounded-xl font-bold bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                >
                  Lihat Demo
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <motion.img
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="/login_illustration.png"
                  alt="Ilustrasi E-Office"
                  className="relative w-full max-w-md object-contain rounded-3xl border-4 border-white shadow-2xl cursor-pointer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="cara kerja" className="py-20 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proses yang mudah dan cepat hanya dalam 4 langkah sederhana
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                key={step.number}
                className="relative"
              >
                {step.number !== "04" && (
                  <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-blue-200"></div>
                )}
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center hover:scale-[1.03]">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="fitur"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai fitur canggih untuk memudahkan proses administrasi
              akademik Anda
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        id="statistik"
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Statistik Sistem
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Capaian dan performa sistem E-Office Kampus
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {statistics.map((stat, index) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-sm text-blue-100 mb-2">{stat.label}</div>
                <div className="text-xs text-green-300">{stat.trend}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="Manfaat" className="py-20 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Manfaat Menggunakan E-Office Kampus
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi digital untuk meningkatkan efisiensi layanan administrasi
              akademik.
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Update Terbaru */}
      <section
        id="Update"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              🔔 Update Terbaru
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-5 mb-4">
              Update Terbaru Sistem
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Rilis E-Office v2.0 (Mei 2026) menghadirkan workflow surat yang
              lebih jelas, notifikasi pintar, dan panel admin untuk pengelolaan
              kampus yang lebih efisien.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="grid md:grid-cols-2 gap-8"
          >
            {newsAndUpdates.map((item, index) => (
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                key={item.title}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="px-6 py-4 border-b bg-gray-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 text-sm">
                    {item.updates.map((update, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{update}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t bg-gray-50 p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="tentang"
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                Tentang E-Office Kampus
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                E-Office Kampus dikembangkan untuk mendukung digitalisasi
                administrasi akademik di lingkungan perguruan tinggi. Dengan
                sistem ini, proses surat-menyurat, pengajuan tugas akhir, dan
                manajemen dokumen menjadi lebih mudah, cepat, dan transparan.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Autentikasi aman dengan JWT
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Role-based access control
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Upload &amp; download dokumen PDF
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    Tracking status real-time
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("pelajari-lebih-lanjut")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all cursor-pointer"
              >
                Pelajari lebih lanjut <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-8">
                <img
                  src="/tentang_eoffice_campus.png"
                  alt="Ilustrasi Digitalisasi"
                  className="w-full max-w-md object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pelajari Lebih Lanjut — Alur & Peran Pengguna */}
      <section id="pelajari-lebih-lanjut" className="py-20 bg-white border-t border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Bagaimana E-Office Kampus Bekerja?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Sistem ini dirancang untuk tiga peran utama. Setiap role memiliki tugas berbeda
              dalam alur pengajuan surat dan judul Tugas Akhir.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                role: "Mahasiswa",
                color: "border-blue-200 bg-blue-50",
                icon: "🎓",
                tasks: [
                  "Mengajukan surat administrasi (aktif kuliah, izin penelitian, dll)",
                  "Mengajukan judul Tugas Akhir + upload proposal PDF",
                  "Memantau status di Riwayat Pengajuan & Tugas Akhir",
                  "Menerima notifikasi saat disetujui/ditolak dosen",
                ],
              },
              {
                role: "Dosen Pembimbing",
                color: "border-green-200 bg-green-50",
                icon: "👨‍🏫",
                tasks: [
                  "Menerima notifikasi pengajuan baru dari mahasiswa",
                  "Meninjau dokumen di menu Persetujuan",
                  "Menyetujui atau menolak dengan catatan",
                  "Memantau daftar TA di menu Tugas Akhir",
                ],
              },
              {
                role: "Admin / Staff",
                color: "border-orange-200 bg-orange-50",
                icon: "👨‍💼",
                tasks: [
                  "Mengelola akun user (mahasiswa, dosen, admin)",
                  "Memantau statistik pengajuan di dashboard",
                  "Membantu persetujuan pengajuan jika diperlukan",
                  "Menerima notifikasi pengajuan masuk",
                ],
              },
            ].map((item, idx) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl border-2 p-6 ${item.color}`}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.role}</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {item.tasks.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Alur Pengajuan Judul TA</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-sm">
              {[
                { step: "1", label: "Mahasiswa ajukan judul + PDF", icon: "📝" },
                { step: "2", label: "Dosen/Admin dapat notifikasi", icon: "🔔" },
                { step: "3", label: "Review di menu Persetujuan", icon: "✅" },
                { step: "4", label: "Mahasiswa lihat hasil & catatan", icon: "🎓" },
              ].map((s) => (
                <div key={s.step} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-bold text-blue-200 mb-1">Langkah {s.step}</div>
                  <div className="font-medium">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Daftar sebagai Mahasiswa
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                Sudah Punya Akun? Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Siap Memulai Digitalisasi Administrasi?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Daftar sekarang dan rasakan kemudahan mengelola surat & tugas akhir
            secara online
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl font-bold bg-white text-blue-600 hover:shadow-xl transition-all duration-300"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl font-bold border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="Footer" className="bg-gray-900 text-gray-300 py-12">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">
                  E-Office Kampus
                </span>
              </div>
              <p className="text-sm">
                Sistem Informasi Surat & Tugas Akhir Terintegrasi
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#fitur" className="hover:text-blue-400 transition">
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#statistik"
                    className="hover:text-blue-400 transition"
                  >
                    Statistik
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="hover:text-blue-400 transition">
                    Tentang
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); setActiveModal('bantuan'); }}
                    className="hover:text-blue-400 transition text-left focus:outline-none bg-transparent border-0 cursor-pointer p-0"
                  >
                    Pusat Bantuan
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); setActiveModal('panduan'); }}
                    className="hover:text-blue-400 transition text-left focus:outline-none bg-transparent border-0 cursor-pointer p-0"
                  >
                    Panduan Pengguna
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); setActiveModal('faq'); setFaqSearchQuery(''); setFaqOpenIndex(null); }}
                    className="hover:text-blue-400 transition text-left focus:outline-none bg-transparent border-0 cursor-pointer p-0"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Hubungi Kami</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@eofficekampus.ac.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(021) 1234-5678</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 E-Office Kampus. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                    {activeModal === "panduan" && <BookOpen className="w-6 h-6" />}
                    {activeModal === "bantuan" && <MessageSquare className="w-6 h-6" />}
                    {activeModal === "faq" && <HelpCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-gray-900 capitalize">
                      {activeModal === "panduan" && "Panduan Pengguna"}
                      {activeModal === "bantuan" && "Pusat Bantuan"}
                      {activeModal === "faq" && "Frequently Asked Questions (FAQ)"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {activeModal === "panduan" && "Petunjuk penggunaan sistem E-Office Kampus"}
                      {activeModal === "bantuan" && "Hubungi tim support akademik kami"}
                      {activeModal === "faq" && "Jawaban atas pertanyaan yang sering diajukan"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Modal Content Wrapper */}
              <div className="flex-grow p-6 overflow-y-auto">
                {/* 1. PANDUAN PENGGUNA MODAL */}
                {activeModal === "panduan" && (
                  <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
                      {["mahasiswa", "dosen", "admin"].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveGuideTab(tab)}
                          className={`flex-1 py-2 text-center text-sm font-extrabold rounded-xl capitalize transition-all ${
                            activeGuideTab === tab
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="space-y-4">
                      {activeGuideTab === "mahasiswa" && (
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-1">🔐 Langkah 1: Registrasi Akun</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Daftar akun menggunakan NIM Anda, isi Nama Lengkap, Email aktif, dan buat Password minimal 6 karakter. Pastikan memilih role <b>Mahasiswa</b>.
                            </p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-1">📄 Langkah 2: Pengajuan Surat</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Buka halaman dashboard mahasiswa, klik <b>Buat Pengajuan</b>, pilih jenis <b>Surat</b>, isi perihal dan lampirkan berkas persyaratan berformat PDF (maksimal 5MB).
                            </p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-1">🎓 Langkah 3: Pengajuan Judul Tugas Akhir</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Pada form pengajuan, pilih kategori <b>Tugas Akhir</b>, tulis Judul proposal Anda, isi deskripsi perihal secara ringkas, dan upload berkas draf proposal (PDF).
                            </p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-1">🔔 Langkah 4: Pantau Progres Real-Time</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Pantau proses verifikasi secara real-time. Jika disetujui, Anda akan mendapatkan notifikasi instan dan berkas bertanda tangan digital siap diunduh.
                            </p>
                          </div>
                        </div>
                      )}

                      {activeGuideTab === "dosen" && (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <h4 className="font-bold text-green-800 mb-1">🖥️ Langkah 1: Akses Dashboard Dosen</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Login menggunakan akun Dosen Anda (username/NIDN). Anda akan disajikan rangkuman visual pengajuan mahasiswa yang butuh persetujuan.
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <h4 className="font-bold text-green-800 mb-1">🔍 Langkah 2: Review Dokumen Mahasiswa</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Klik pada baris pengajuan untuk meninjau berkas PDF/proposal Tugas Akhir mahasiswa secara online atau mengunduhnya langsung ke perangkat Anda.
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                            <h4 className="font-bold text-green-800 mb-1">✍️ Langkah 3: Berikan Keputusan & Catatan</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Berikan aksi berupa <b>Setujui</b> atau <b>Tolak</b>, sertakan catatan konstruktif/catatan revisi pada kolom yang tersedia untuk membimbing mahasiswa.
                            </p>
                          </div>
                        </div>
                      )}

                      {activeGuideTab === "admin" && (
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h4 className="font-bold text-purple-800 mb-1">📊 Langkah 1: Monitor Statistik Akademik</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Lihat diagram total pengguna, total surat diproses, surat menunggu tindakan, serta riwayat aktivitas harian seluruh sivitas akademika.
                            </p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h4 className="font-bold text-purple-800 mb-1">👥 Langkah 2: Manajemen Akun Pengguna</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Tambahkan akun mahasiswa atau dosen secara manual, edit detail profil, tetapkan hak akses/role khusus, atau hapus akun bermasalah dengan aman.
                            </p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h4 className="font-bold text-purple-800 mb-1">🛠️ Langkah 3: Pengawasan Alur Kerja Dokumen</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Awasi antrean surat masuk, lacak jika ada keterlambatan proses persetujuan, dan bantu mencetak arsip surat fisik untuk keperluan administrasi luring.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. PUSAT BANTUAN MODAL */}
                {activeModal === "bantuan" && (
                  <div className="space-y-6">
                    {/* Contact Channels Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 bg-slate-50 border hover:bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition group decoration-none"
                      >
                        <span className="text-2xl mb-1 group-hover:scale-110 transition duration-300">💬</span>
                        <h5 className="font-bold text-sm text-gray-800">WhatsApp Support</h5>
                        <p className="text-xs text-gray-500 mt-0.5">+62 812-3456-7890</p>
                      </a>
                      <div className="p-4 bg-slate-50 border rounded-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-2xl mb-1">📞</span>
                        <h5 className="font-bold text-sm text-gray-800">Layanan Telepon</h5>
                        <p className="text-xs text-gray-500 mt-0.5">(021) 1234-5678</p>
                      </div>
                    </div>

                    {/* Email banner */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                      <div className="text-2xl">✉️</div>
                      <div className="text-left">
                        <h5 className="font-bold text-sm text-blue-900">Email Hubungan Akademik</h5>
                        <p className="text-xs text-blue-700">support@eofficekampus.ac.id (Tanggapan 1x24 jam)</p>
                      </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleHelpSubmit} className="space-y-4">
                      <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">Kirim Laporan / Hubungi Kami</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Nama Anda</label>
                          <input
                            type="text"
                            required
                            placeholder="Nama Lengkap"
                            value={helpForm.nama}
                            onChange={(e) => setHelpForm({ ...helpForm, nama: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Email Aktif</label>
                          <input
                            type="email"
                            required
                            placeholder="alamat@email.com"
                            value={helpForm.email}
                            onChange={(e) => setHelpForm({ ...helpForm, email: e.target.value })}
                            className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Kategori Masalah</label>
                        <select
                          value={helpForm.kategori}
                          onChange={(e) => setHelpForm({ ...helpForm, kategori: e.target.value })}
                          className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 cursor-pointer"
                        >
                          <option value="Akun">Pendaftaran / Login Akun</option>
                          <option value="Pengajuan Surat">Pengajuan Surat Online</option>
                          <option value="Tugas Akhir">Tugas Akhir / Proposal</option>
                          <option value="Sistem Error">Error Sistem / Bug Aplikasi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Pesan Laporan</label>
                        <textarea
                          required
                          rows="3"
                          placeholder="Jelaskan kendala Anda secara mendetail..."
                          value={helpForm.pesan}
                          onChange={(e) => setHelpForm({ ...helpForm, pesan: e.target.value })}
                          className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition duration-300 shadow"
                      >
                        Kirim Pesan Dukungan
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. FAQ MODAL */}
                {activeModal === "faq" && (
                  <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Search className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari pertanyaan Anda disini..."
                        value={faqSearchQuery}
                        onChange={(e) => setFaqSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Accordion Questions */}
                    <div className="space-y-3">
                      {faqs
                        .filter(
                          (item) =>
                            item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                            item.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
                        )
                        .map((item, idx) => {
                          const isOpen = faqOpenIndex === idx;
                          return (
                            <div
                              key={idx}
                              className="border rounded-2xl overflow-hidden bg-gray-50 hover:bg-white transition-all"
                            >
                              <button
                                type="button"
                                onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none bg-transparent border-0 cursor-pointer"
                              >
                                <span className="font-bold text-gray-800 text-sm md:text-base pr-4">{item.q}</span>
                                <ChevronRight
                                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${
                                    isOpen ? "rotate-90 text-blue-600" : ""
                                  }`}
                                />
                              </button>
                              
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-5 pb-5 border-t border-gray-150 pt-3"
                                  >
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      
                      {faqs.filter(
                        (item) =>
                          item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
                          item.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="text-center py-10">
                          <p className="text-gray-500 font-semibold text-sm">Pertanyaan tidak ditemukan. Coba dengan kata kunci lain.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
