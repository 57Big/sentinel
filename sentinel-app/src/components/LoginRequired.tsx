import { Link } from 'react-router-dom';

const LoginRequired = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-6xl">
            lock
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Login talab qilinadi
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Ushbu sahifani ko'rish va funksiyalardan foydalanish uchun tizimga kirish kerak.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Tizimga kirish
          </Link>

          <Link
            to="/register"
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Ro'yxatdan o'tish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;
