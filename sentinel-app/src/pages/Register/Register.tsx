import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from './_api';
import type { RegisterRequest } from '@/types/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Parollar mos kelmadi');
      return;
    }

    if (formData.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(formData);

      if (response.success) {
        navigate('/home');
      }
    } catch (err: any) {
      setError(err.message || "Ro'yxatdan o'tish muvaffaqiyatsiz");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* TopAppBar suppressed for transactional focused page as per Shell Visibility Rules */}
      <header className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm shadow-indigo-500/5">
        <div className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-indigo-700 text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
            <span className="text-2xl font-black tracking-tighter text-indigo-700">Sentinel</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Registration Card */}
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_20px_40px_rgba(53,37,205,0.06)] border border-outline-variant/10">
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-3 headline-font">
                Ro'yxatdan o'tish
              </h1>
              <p className="text-on-surface-variant font-medium">Xavfsiz tahlil dunyosiga xush kelibsiz</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Ism Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="name">
                  Ism
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-DEFAULT focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all outline-none text-on-surface placeholder:text-outline/60"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ismingizni kiriting"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="email">
                  Email
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-DEFAULT focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all outline-none text-on-surface placeholder:text-outline/60"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Parol Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="password">
                  Parol
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-DEFAULT focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all outline-none text-on-surface placeholder:text-outline/60"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Parolni tasdiqlash Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="confirmPassword">
                  Parolni tasdiqlash
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    shield_lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-DEFAULT focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all outline-none text-on-surface placeholder:text-outline/60"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-error-container text-on-error-container rounded-DEFAULT text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 space-y-4">
                <button
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-DEFAULT shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">Yoki</span>
                  <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                </div>

                <Link
                  className="block w-full py-4 text-center bg-surface-container border border-outline-variant/20 text-on-surface-variant font-semibold rounded-DEFAULT hover:bg-surface-container-high active:scale-[0.98] transition-all duration-200"
                  to="/login"
                >
                  Kirish sahifasiga o'tish
                </Link>
              </div>
            </form>
          </div>

          {/* Footer Link Section */}
          <p className="mt-8 text-center text-on-surface-variant font-body">
            Hisobingiz bormi?
            <Link
              className="ml-1 text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              to="/login"
            >
              Kirish
            </Link>
          </p>

          {/* Legal/Microcopy */}
          <footer className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-outline uppercase tracking-[0.1em]">
            <a className="hover:text-primary-container transition-colors" href="#">
              Maxfiylik siyosati
            </a>
            <a className="hover:text-primary-container transition-colors" href="#">
              Xizmat ko'rsatish shartlari
            </a>
            <span className="opacity-50">© 2026 Sentinel</span>
          </footer>

          {/* Background Decoration (Asymmetric approach) */}
          <div className="fixed -z-10 top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="fixed -z-10 bottom-0 left-0 w-[300px] h-[300px] bg-secondary-container/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </main>
      {/* BottomNavBar suppressed for focused transactional screen */}
    </div>
  );
};

export default Register;
