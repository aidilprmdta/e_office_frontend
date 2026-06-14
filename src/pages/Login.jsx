import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Users,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { authService } from "../services";
import { saveUserSession, normalizeRole } from "../utils";

export default function Login({ initialTab }) {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(() => {
    if (initialTab === "register") return true;
    if (location.state && location.state.register) return true;
    return false;
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: "Oops!",
        text: "Harap masukkan username/NIM/NIDN dan password Anda.",
        icon: "warning",
        confirmButtonColor: "#1D63DC",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: email,
        password: password,
      });

      const token = response.data.access_token;
      const userData = response.data.user || {};

      saveUserSession(token, {
        id: userData.id,
        username: userData.username,
        nama: userData.nama ?? "Pengguna",
        role: normalizeRole(userData.role),
      });

      Swal.fire({
        title: "Berhasil Masuk!",
        text: `Selamat datang kembali, ${userData.nama || "Pengguna"}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      Swal.fire({
        title: "Gagal Masuk",
        text:
          err.response?.data?.detail ||
          err.userMessage ||
          "Kredensial salah atau terjadi kesalahan pada server.",
        icon: "error",
        confirmButtonColor: "#1D63DC",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nama || !email || !password) {
      Swal.fire({
        title: "Formulir Belum Lengkap",
        text: "Harap lengkapi semua field yang tersedia.",
        icon: "warning",
        confirmButtonColor: "#1D63DC",
      });
      return;
    }

    setLoading(true);
    try {
      // KUNCI PERBAIKAN: Mapping state 'email' menjadi 'username'
      await authService.register({
        username: email,
        nama: nama,
        password: password,
        role: role,
      });

      Swal.fire({
        title: "Pendaftaran Berhasil!",
        text: "Akun Anda telah berhasil terdaftar. Silakan login.",
        icon: "success",
        confirmButtonColor: "#1D63DC",
      });
      setIsRegister(false);
    } catch (err) {
      Swal.fire({
        title: "Pendaftaran Gagal",
        text:
          err.response?.data?.detail ||
          err.userMessage ||
          "Registrasi gagal. Cek kembali data Anda.",
        icon: "error",
        confirmButtonColor: "#1D63DC",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-150 flex flex-col md:flex-row">
        <div className="w-full md:w-[45%] bg-[#EAF1FF] p-8 md:p-10 flex flex-col relative overflow-hidden min-h-[450px] md:min-h-full">
          {/* Logo & Sub-header */}
          <div className="flex items-center gap-3 z-10 mb-6 md:mb-8">
            <div className="bg-[#1D63DC] p-2 rounded-xl text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-sm tracking-wide text-[#1E293B] uppercase">
                SISTEM AKADEMIK
              </h2>
              <p className="text-xs text-[#1D63DC] font-semibold">
                Universitas UIN SUSKA RIAU
              </p>
            </div>
          </div>

          <div className="w-full flex-grow flex flex-col justify-center z-10 text-left py-4 md:py-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight mb-2">
              {isRegister ? "Buat Akun Anda!" : "Selamat Datang!"}
            </h1>
            <p className="text-[#64748B] text-sm md:text-base leading-relaxed mb-6 font-medium max-w-sm">
              {isRegister
                ? "Lengkapi formulir untuk mendaftar dan mulai mengakses layanan akademik."
                : "Silakan masuk untuk mengakses sistem akademik kampus."}
            </p>

            <div className="w-full max-w-[280px] md:max-w-[320px] mx-auto mt-4">
              <img
                src="/login_illustration.png"
                alt="Ilustrasi Akademik"
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          <div className="z-10 text-xs text-[#94A3B8] font-semibold mt-6 md:mt-8">
            © 2026 Universitas UIN SUSKA RIAU. Semua Hak Dilindungi.
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full filter blur-2xl opacity-80 pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white text-left">
          <div className="flex border-b border-gray-200 mb-8 w-full">
            <button
              onClick={() => {
                setIsRegister(false);
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 pb-4 text-center font-bold text-lg transition-all border-b-2 relative ${
                !isRegister
                  ? "text-[#1D63DC] border-[#1D63DC]"
                  : "text-[#94A3B8] border-transparent hover:text-gray-600"
              }`}
            >
              Login
              {!isRegister && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D63DC]"
                />
              )}
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 pb-4 text-center font-bold text-lg transition-all border-b-2 relative ${
                isRegister
                  ? "text-[#1D63DC] border-[#1D63DC]"
                  : "text-[#94A3B8] border-transparent hover:text-gray-600"
              }`}
            >
              Register
              {isRegister && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D63DC]"
                />
              )}
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {!isRegister ? (
              // LOGIN FORM VARIANT
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                    Masuk ke Akun Anda
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-medium">
                    Gunakan akun yang telah terdaftar
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Username / NIM / NIDN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan username / NIM / NIDN"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Role Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Pilih Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen</option>
                        <option value="admin">Administrator / Staff</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1D63DC] hover:bg-[#154db3] disabled:bg-blue-300 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200 mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? "Menghubungkan..." : "Masuk"}
                  </button>
                </form>

                {/* Divider Line */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-150"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-[#94A3B8]">
                    atau
                  </span>
                  <div className="flex-grow border-t border-gray-150"></div>
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Belum punya akun?{" "}
                    <button
                      onClick={() => setIsRegister(true)}
                      className="text-[#1D63DC] font-bold hover:underline"
                    >
                      Daftar disini
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              // REGISTER FORM VARIANT
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                    Daftar Akun Baru
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-medium">
                    Lengkapi data untuk mendaftar
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Full Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan alamat email aktif"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Buat Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Buat password minimal 6 karakter"
                        className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Role Select Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Pilih Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen</option>
                        <option value="admin">Administrator / Staff</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1D63DC] hover:bg-[#154db3] disabled:bg-blue-300 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200 mt-4 flex items-center justify-center gap-2"
                  >
                    {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                  </button>
                </form>

                {/* Divider Line */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-150"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-[#94A3B8]">
                    atau
                  </span>
                  <div className="flex-grow border-t border-gray-150"></div>
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Sudah memiliki akun?{" "}
                    <button
                      onClick={() => setIsRegister(false)}
                      className="text-[#1D63DC] font-bold hover:underline"
                    >
                      Masuk disini
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
