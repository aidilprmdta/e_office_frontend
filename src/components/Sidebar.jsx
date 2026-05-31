import { useState, useEffect } from 'react';
import { clearUserSession } from '../utils';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📝', label: 'Buat Pengajuan Surat', path: '/pengajuan', allowedRoles: ['mahasiswa'] },
    { icon: '🎓', label: 'Ajukan Judul TA', path: '/pengajuan-judul-ta', allowedRoles: ['mahasiswa'] },
    { icon: '📋', label: 'Riwayat Pengajuan', path: '/riwayat-pengajuan', allowedRoles: ['mahasiswa'] },
    { icon: '🔔', label: 'Notifikasi', path: '/notifikasi' },
    { icon: '📨', label: 'Pengajuan Surat', path: '/surat-masuk' },
    { icon: '🎓', label: 'Tugas Akhir', path: '/tugas-akhir' },
    { icon: '✅', label: 'Persetujuan', path: '/persetujuan', allowedRoles: ['dosen', 'admin'] },
    { icon: '👥', label: 'Manajemen User', path: '/users', allowedRoles: ['admin'] },
  ];

  const handleLogout = () => {
    clearUserSession();
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const filteredItems = menuItems.filter((item) => {
    if (item.allowedRoles) {
      return item.allowedRoles.includes(role || 'mahasiswa');
    }
    return true;
  });

  const sidebarVisible = isMobile ? isOpen : true;

  return (
    <>
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      )}

      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white shadow-2xl z-40 overflow-hidden transition-transform duration-300 ${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-blue-800 bg-blue-950/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📬</div>
            <div>
              <h1 className="text-xl font-bold leading-5">E-Office</h1>
              <p className="text-xs text-blue-200">Kampus Management</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2 px-4 pb-32 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {filteredItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-lg font-bold'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white font-medium'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <span className="absolute right-4 w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-blue-800 bg-blue-950/60">
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-950/30 hover:text-red-200 transition-all duration-200 font-bold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
          <div className="py-2 text-center text-xs text-blue-300 border-t border-blue-800">
            <p>v2.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
