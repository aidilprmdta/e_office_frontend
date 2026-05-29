import { useState, useEffect } from 'react';
import { getStoredUser } from '../utils';

export function useAuth() {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener('auth-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('auth-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const role = user?.role?.toLowerCase() || null;

  return {
    user,
    role,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
  };
}
