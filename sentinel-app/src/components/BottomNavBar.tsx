import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BottomNavBar = () => {
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
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-indigo-50 dark:border-indigo-900/20 shadow-[0_-10px_40px_rgba(53,37,205,0.08)]">
      <Link
        to="/home"
        className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
          isActive('/home') || isActive('/')
            ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl scale-110 shadow-lg shadow-indigo-200 dark:shadow-none'
            : 'text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500'
        }`}
      >
        <span className="material-symbols-outlined" data-icon="home">
          home
        </span>
        <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
          Bosh
        </span>
      </Link>

      <Link
        to="/check"
        className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
          isActive('/check')
            ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl scale-110 shadow-lg shadow-indigo-200 dark:shadow-none'
            : 'text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500'
        }`}
      >
        <span className="material-symbols-outlined" data-icon="search_check">
          search_check
        </span>
        <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
          Tekshirish
        </span>
      </Link>

      {/* Moderatsiya yoki Admin sahifasi - faqat tegishli rollarga */}
      {userRole === 'admin' ? (
        <Link
          to="/admin"
          className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
            isActive('/admin')
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl scale-110 shadow-lg shadow-indigo-200 dark:shadow-none'
              : 'text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500'
          }`}
        >
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
            Admin
          </span>
        </Link>
      ) : userRole === 'moderator' ? (
        <Link
          to="/moderation"
          className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
            isActive('/moderation')
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl scale-110 shadow-lg shadow-indigo-200 dark:shadow-none'
              : 'text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500'
          }`}
        >
          <span className="material-symbols-outlined" data-icon="check_circle">
            check_circle
          </span>
          <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
            Moderatsiya
          </span>
        </Link>
      ) : (
        <Link
          to="/results"
          className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
            isActive('/results')
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl scale-110 shadow-lg shadow-indigo-200 dark:shadow-none'
              : 'text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500'
          }`}
        >
          <span className="material-symbols-outlined" data-icon="list_alt">
            list_alt
          </span>
          <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
            Natijalar
          </span>
        </Link>
      )}

      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500"
        >
          <span className="material-symbols-outlined" data-icon="logout">
            logout
          </span>
          <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
            Chiqish
          </span>
        </button>
      ) : (
        <Link
          to="/login"
          className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
            isActive('/login')
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl scale-110 shadow-lg shadow-indigo-200 dark:shadow-none'
              : 'text-slate-400 dark:text-slate-500 opacity-70 hover:text-indigo-500'
          }`}
        >
          <span className="material-symbols-outlined" data-icon="login">
            login
          </span>
          <span className="font-['Inter'] text-[11px] font-semibold tracking-wide uppercase mt-1">
            Kirish
          </span>
        </Link>
      )}
    </nav>
  );
};

export default BottomNavBar;
