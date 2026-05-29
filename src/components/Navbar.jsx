import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, notifikasiService } from '../services';
import { clearUserSession, getStoredUser, formatDateTime } from '../utils';

function getNotifIcon(pesan) {
  const p = (pesan || '').toLowerCase();
  if (p.includes('disetujui')) return '✅';
  if (p.includes('ditolak')) return '❌';
  if (p.includes('tugas akhir')) return '🎓';
  if (p.includes('pengajuan baru')) return '📨';
  return '🔔';
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return formatDateTime(dateString);
}

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || token.startsWith('mock-')) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const [listRes, countRes] = await Promise.all([
        notifikasiService.getAll(),
        notifikasiService.getUnreadCount(),
      ]);
      setNotifications((listRes.data || []).slice(0, 8));
      setUnreadCount(countRes.data?.belum_dibaca ?? 0);
    } catch (err) {
      console.error('Gagal memuat notifikasi', err);
    }
  }, []);

  useEffect(() => {
    const refreshUser = () => setUser(getStoredUser());
    refreshUser();
    loadNotifications();

    window.addEventListener('auth-change', refreshUser);
    const interval = setInterval(loadNotifications, 30000);
    return () => {
      window.removeEventListener('auth-change', refreshUser);
      clearInterval(interval);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (!user) {
      authService
        .getProfile()
        .then((res) => {
          const profile = res.data;
          setUser(profile);
        })
        .catch(() => {});
    }
  }, [user]);

  const userData = {
    name: user?.nama || 'User Kampus',
    role:
      user?.role === 'admin'
        ? 'Administrator'
        : user?.role === 'dosen'
        ? 'Dosen Pembimbing'
        : 'Mahasiswa',
    username: user?.username || '',
    avatar: user?.role === 'admin' ? '👨‍💼' : user?.role === 'dosen' ? '👨‍🏫' : '👤',
  };

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <header className="bg-white shadow-md border-b-2 border-blue-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 ml-12 md:ml-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">E-Office Kampus</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sistem Manajemen Surat & Tugas Akhir</p>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) loadNotifications();
              }}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-[28rem] overflow-hidden flex flex-col"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Notifikasi</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 transition-colors ${
                              !notif.is_read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              <span className="text-xl flex-shrink-0">
                                {getNotifIcon(notif.pesan)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 leading-snug">
                                  {notif.pesan}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {timeAgo(notif.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        Belum ada notifikasi untuk akun Anda.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 p-3 text-center bg-gray-50">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifikasi');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all border border-gray-200"
            >
              <div className="text-xl md:text-2xl">{userData.avatar}</div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-4">{userData.name}</p>
                <p className="text-xs text-gray-500 leading-3 mt-0.5">{userData.role}</p>
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 border-b border-gray-200">
                    <p className="text-sm font-bold text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {userData.username || userData.role}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User size={18} />
                    <span>Dashboard Utama</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold border-t border-gray-100"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
