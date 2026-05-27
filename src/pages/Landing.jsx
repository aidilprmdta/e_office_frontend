import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Pengajuan Surat Online",
      description: "Ajukan berbagai surat akademik (aktif kuliah, izin penelitian, rekomendasi, dll) secara digital 24/7",
      color: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: BookOpen,
      title: "Pendaftaran Judul TA",
      description: "Daftarkan judul Tugas Akhir, upload proposal, dan lacak proses persetujuan dosen pembimbing",
      color: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Bell,
      title: "Notifikasi Real-time",
      description: "Dapatkan notifikasi status pengajuan, revisi, dan persetujuan langsung via email & dashboard",
      color: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Users,
      title: "Manajemen Multi-role",
      description: "Akses sesuai role: Mahasiswa, Dosen, Staff, dan Admin dengan fitur yang disesuaikan",
      color: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      icon: ShieldCheck,
      title: "Keamanan Terjamin",
      description: "Sistem keamanan dengan JWT, enkripsi data, dan perlindungan terhadap akses tidak sah",
      color: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: TrendingUp,
      title: "Laporan & Analitik",
      description: "Dashboard analitik untuk melihat statistik pengajuan, trending, dan performa sistem",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const statistics = [
    { number: "1,200+", label: "Total Pengajuan", icon: FileText, trend: "+23%" },
    { number: "350+", label: "Akun Terdaftar", icon: Users, trend: "+15%" },
    { number: "200+", label: "Judul TA Terdaftar", icon: BookOpen, trend: "+32%" },
    { number: "3,000+", label: "Notifikasi Terkirim", icon: Bell, trend: "+45%" },
    { number: "98%", label: "Kepuasan Pengguna", icon: Award, trend: "+5%" },
    { number: "24/7", label: "Layanan Aktif", icon: Zap, trend: "Always" }
  ];

  const benefits = [
  {
    title: "Menghemat Waktu",
    description:
      "Mahasiswa tidak perlu datang ke kampus hanya untuk mengajukan surat atau memantau status pengajuan."
  },
  {
    title: "Proses Lebih Cepat",
    description:
      "Pengajuan surat dan tugas akhir dapat diproses secara digital dengan alur yang terstruktur."
  },
  {
    title: "Transparansi Status",
    description:
      "Pengguna dapat memantau status pengajuan secara real-time tanpa harus bertanya ke bagian administrasi."
  },
  {
    title: "Akses Kapan Saja",
    description:
      "Sistem dapat digunakan 24 jam sehari dari mana saja melalui perangkat yang terhubung internet."
  },
  {
    title: "Mengurangi Penggunaan Kertas",
    description:
      "Seluruh proses administrasi dilakukan secara digital sehingga lebih ramah lingkungan."
  },
  {
    title: "Dokumen Tersimpan Aman",
    description:
      "Data dan dokumen tersimpan secara terpusat sehingga lebih mudah dikelola dan dicari kembali."
  }
];

  const steps = [
    { number: "01", title: "Registrasi Akun", description: "Daftar dengan NIM/NIP dan verifikasi email", icon: UserPlus },
    { number: "02", title: "Ajukan Permohonan", description: "Pilih jenis surat/TA dan upload dokumen", icon: Send },
    { number: "03", title: "Proses Verifikasi", description: "Petugas/Dosen akan memverifikasi pengajuan", icon: Clock },
    { number: "04", title: "Selesai & Download", description: "Dapatkan surat digital & unduh dokumen", icon: Download }
  ];

  const newsAndUpdates = [
  {
    title: "Pengajuan Surat",
    icon: FileText,
    color: "blue",
    updates: [
      "Pengajuan surat aktif kuliah",
      "Surat izin penelitian",
      "Surat rekomendasi",
      "Tracking status real-time"
    ],
    desc: "Memudahkan proses administrasi surat mahasiswa."
  },
  {
    title: "Tugas Akhir",
    icon: BookOpen,
    color: "green",
    updates: [
      "Pendaftaran judul TA",
      "Upload proposal",
      "Persetujuan dosen",
      "Monitoring progres"
    ],
    desc: "Mengelola proses tugas akhir secara digital."
  },
  {
    title: "Notifikasi",
    icon: Bell,
    color: "purple",
    updates: [
      "Notifikasi email",
      "Update status otomatis",
      "Reminder pengajuan",
      "Informasi persetujuan"
    ],
    desc: "Memberikan informasi terbaru kepada pengguna."
  },
  {
    title: "Coming Soon",
    icon: Zap,
    color: "orange",
    updates: [
      "Integrasi SIAKAD",
      "Tanda tangan digital",
      "Mobile App",
      "Fitur AI Assistant"
    ],
    desc: "Fitur baru sedang dalam pengembangan."
  }
 ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col font-sans">
      {/* Header/Navbar dengan efek blur */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
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
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-gray-700 font-semibold text-sm">
            {["cara kerja", "fitur", "statistik", "Manfaat", "Update", "tentang", "Footer"].map((item) => (
              <a key={item}
                 href={`#${item}`}
                 className="hover:text-blue-600 transition-colors duration-200 capitalize">
                 {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-3">
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
              {["cara kerja", "fitur", "statistik", "Manfaat", "Update", "tentang", "Footer"].map((item) => (
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
                <Link to="/login" className="flex-1 text-center px-4 py-2 rounded-xl font-bold border-2 border-blue-600 text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="flex-1 text-center px-4 py-2 rounded-xl font-bold bg-blue-600 text-white">
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
            <div className="flex-1 text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Sistem Terintegrasi</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Mudahkan{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Pengajuan Surat
                </span>{" "}
                & Tugas Akhir
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                E-Office Kampus adalah platform digital untuk memproses pengajuan surat,
                pendaftaran judul Tugas Akhir, dan manajemen dokumen akademik secara
                cepat, aman, dan transparan.
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
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <img
                  src="/login_illustration.png"
                  alt="Ilustrasi E-Office"
                  className="relative w-full max-w-md object-contain rounded-3xl border-4 border-white shadow-2xl"
                />
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                {step.number !== "04" && (
                  <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-blue-200"></div>
                )}
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{step.number}</div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai fitur canggih untuk memudahkan proses administrasi akademik Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistik" className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-blue-100 mb-2">{stat.label}</div>
                <div className="text-xs text-green-300">{stat.trend}</div>
              </div>
            ))}
          </div>
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
              Solusi digital untuk meningkatkan efisiensi layanan administrasi akademik.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Update Terbaru */}
      <section id="Update" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              🔔 Update Terbaru
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-5 mb-4">
              Update Terbaru Sistem
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dari kemudahan akses sampai efisiensi administrasi,
              semua layanan kami terus dikembangkan untuk pengalaman
              pengguna yang lebih baik.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {newsAndUpdates.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >

          {/* Header terminal */}
          <div className="px-6 py-4 border-b bg-gray-200">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-3 text-sm">
              {item.updates.map((update, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{update}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <item.icon className="w-7 h-7 text-blue-600" />
            </div>

            <div>
              <h3 className="font-bold text-xl text-gray-800">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="tentang" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                Tentang E-Office Kampus
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                E-Office Kampus dikembangkan untuk mendukung digitalisasi administrasi akademik
                di lingkungan perguruan tinggi. Dengan sistem ini, proses surat-menyurat,
                pengajuan tugas akhir, dan manajemen dokumen menjadi lebih mudah, cepat, dan transparan.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Autentikasi aman dengan JWT</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Role-based access control</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Upload & download dokumen PDF</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Tracking status real-time</span>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
              >
                Pelajari lebih lanjut <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl p-8">
                <img
                  src="/tentang_eoffice_campus.png"
                  alt="Ilustrasi Digitalisasi"
                  className="w-full max-w-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Siap Memulai Digitalisasi Administrasi?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Daftar sekarang dan rasakan kemudahan mengelola surat & tugas akhir secara online
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl font-bold bg-white text-blue-600 hover:shadow-xl transition-all duration-300"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/demo"
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
                <span className="font-bold text-xl text-white">E-Office Kampus</span>
              </div>
              <p className="text-sm">Sistem Informasi Surat & Tugas Akhir Terintegrasi</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#fitur" className="hover:text-blue-400 transition">Fitur</a></li>
                <li><a href="#statistik" className="hover:text-blue-400 transition">Statistik</a></li>
                <li><a href="#tentang" className="hover:text-blue-400 transition">Tentang</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Panduan Pengguna</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">FAQ</a></li>
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
    </div>
  );
}