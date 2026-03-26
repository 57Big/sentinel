import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const TopAppBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsAuthenticated(!!token);

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || null);
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm shadow-indigo-500/5">
      <div className="flex items-center justify-between px-6 h-16 w-full max-w-7xl mx-auto">
        <Link to="/home" className="flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" data-icon="security">
            security
          </span>
          <span className="text-indigo-700 dark:text-indigo-400 font-extrabold tracking-tighter text-lg headline-font">
            Sentinel
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/home"
            className={`px-3 py-1 rounded-lg transition-colors ${isActive('/home') || isActive('/') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
          >
            Bosh sahifa
          </Link>
          <Link
            to="/check"
            className={`px-3 py-1 rounded-lg transition-colors ${isActive('/check') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
          >
            Tekshirish
          </Link>
          <Link
            to="/results"
            className={`px-3 py-1 rounded-lg transition-colors ${isActive('/results') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
          >
            Natijalar
          </Link>
          <Link
            to="/about"
            className={`px-3 py-1 rounded-lg transition-colors ${isActive('/about') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
          >
            Loyiha haqida
          </Link>
          {(userRole === 'moderator' || userRole === 'admin') && (
            <Link
              to="/moderation"
              className={`px-3 py-1 rounded-lg transition-colors ${isActive('/moderation') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
            >
              Moderatsiya
            </Link>
          )}
          {userRole === 'admin' && (
            <Link
              to="/admin"
              className={`px-3 py-1 rounded-lg transition-colors ${isActive('/admin') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
            >
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            >
              Chiqish
            </button>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-1 rounded-lg transition-colors ${isActive('/login') ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
            >
              Kirish
            </Link>
          )}
        </nav>

        <button className="md:hidden p-2 text-slate-500">
          <span className="material-symbols-outlined" data-icon="menu">
            menu
          </span>
        </button>
      </div>
      <div className="bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full"></div>
    </header>
  );
};

export default TopAppBar;
