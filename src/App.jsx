import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  Login,
  Dashboard,
  DashboardDosen,
  DashboardAdmin,
  SuratMasuk,
  TugasAkhir,
  Persetujuan,
  ManajemenUser,
  NotFound,
  Landing,
  Pengajuan,
  PengajuanJudulTA,
  Riwayat,
  Register,
  Notifikasi,
} from "./pages";
import { isAuthenticated, getUserRole, normalizeRole } from "./utils";
import { useAuth } from "./hooks/useAuth";

function DashboardByRole() {
  const { role } = useAuth();
  const effectiveRole = role || getUserRole() || "mahasiswa";

  if (effectiveRole === "dosen") return <DashboardDosen />;
  if (effectiveRole === "admin") return <DashboardAdmin />;
  return <Dashboard />;
}

function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userRole = getUserRole();
    const allowed = allowedRoles.map(normalizeRole);

    if (!userRole || !allowed.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardByRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surat-masuk"
          element={
            <ProtectedRoute>
              <SuratMasuk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surat-keluar"
          element={<Navigate to="/riwayat-pengajuan" replace />}
        />
        <Route
          path="/tugas-akhir"
          element={
            <ProtectedRoute>
              <TugasAkhir />
            </ProtectedRoute>
          }
        />
        <Route
          path="/persetujuan"
          element={
            <ProtectedRoute allowedRoles={["dosen", "admin"]}>
              <Persetujuan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManajemenUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengajuan"
          element={
            <ProtectedRoute allowedRoles={["mahasiswa"]}>
              <Pengajuan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengajuan-judul-ta"
          element={
            <ProtectedRoute allowedRoles={["mahasiswa"]}>
              <PengajuanJudulTA />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifikasi"
          element={
            <ProtectedRoute>
              <Notifikasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat-pengajuan"
          element={
            <ProtectedRoute allowedRoles={["mahasiswa"]}>
              <Riwayat />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
