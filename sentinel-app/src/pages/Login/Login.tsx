import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './_api';
import type { LoginRequest } from '@/types/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    setError('');
    setLoading(true);

    try {
      console.log('Sending login request...');
      const response = await loginUser(formData);
      console.log('Login response:', response);

      if (response.success) {
        console.log('Login successful');
        // Backend response.user ni to'g'ridan-to'g'ri qaytaradi
        const userRole = response.user?.role || 'user';
        console.log('User role:', userRole);

        if (userRole === 'admin') {
          console.log('Navigating to /admin');
          navigate('/admin', { replace: true });
        } else if (userRole === 'moderator') {
          console.log('Navigating to /moderation');
          navigate('/moderation', { replace: true });
        } else {
          console.log('Navigating to /home');
          navigate('/home', { replace: true });
        }
      } else {
        console.error('Login failed: success is false');
        setError('Login muvaffaqiyatsiz');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Kirish muvaffaqiyatsiz');
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
    <div className="bg-surface text-on-surface flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-container/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Login Shell */}
      <main className="w-full max-w-[480px] z-10">
        {/* Brand Identity Section */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 bg-primary-container flex items-center justify-center rounded-xl shadow-lg shadow-primary/10 mb-6">
            <span className="material-symbols-outlined text-white text-3xl" data-icon="security">
              security
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-on-surface text-center headline-font">
            Sentinel: Tizimga kirish
          </h1>
          <p className="mt-2 text-on-surface-variant font-body text-center max-w-[280px]">
            Xavfsiz tahlil va monitoring tizimiga xush kelibsiz
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_20px_40px_rgba(53,37,205,0.04)] border border-outline-variant/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Field: Login/Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant tracking-wide font-label ml-1" htmlFor="email">
                Login yoki Elektron pochta
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl" data-icon="alternate_email">
                    alternate_email
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-DEFAULT focus:bg-surface-bright focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-on-surface placeholder:text-outline"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="foydalanuvchi@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-sm font-semibold text-on-surface-variant tracking-wide font-label" htmlFor="password">
                  Parol
                </label>
                <a className="text-xs font-semibold text-primary hover:text-primary-container transition-colors" href="#">
                  Parolni unutdingizmi?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl" data-icon="lock">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-11 pr-12 py-4 bg-surface-container-low border-none rounded-DEFAULT focus:bg-surface-bright focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-on-surface"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl" data-icon="visibility">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-error-container text-on-error-container rounded-DEFAULT text-sm font-medium">
                {error}
              </div>
            )}

            {/* Action: Login */}
            <div className="pt-4">
              <button
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary text-white font-bold rounded-DEFAULT shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Yuklanmoqda...' : 'Tizimga kirish'}</span>
                <span className="material-symbols-outlined text-lg" data-icon="login">
                  login
                </span>
              </button>
            </div>
          </form>

          {/* Social/Alternative Login Divider */}
          <div className="relative my-10">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-surface-container-lowest px-4 text-outline">Yoki boshqa usulda</span>
            </div>
          </div>

          {/* Alternative Login Option (Minimalist) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-6 bg-surface-container-low text-on-surface font-semibold rounded-DEFAULT hover:bg-surface-container-high transition-colors"
          >
            <img
              alt="Google"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmdcFwiid5rzVAMUqFqvEQPyjA1glqtBuay0xQ6zzTjRPq26AgUBhFA96ew4PbpLDIQS3eYcIN2vmu90isC_fddw-2GR4WEDkD52SZrjNnnpj1YCNguUINC7--RlAoAsL3mcuobxmS7F6234_uzLi6sGL3l5v4RmnGlnBRGu-g2rvevHFHVS4mufB0WP9GdpTQZtkdM12X7cA1BqtdDM0QUe0WzlPu9xPBGfN8x5LZ2n7RhrLN2AXgdj9V4F-K0VoR_RhS_3dARKc"
            />
            <span>Google bilan kirish</span>
          </button>
        </div>

        {/* Footer Link Section */}
        <p className="mt-8 text-center text-on-surface-variant font-body">
          Hisobingiz yo'qmi?
          <Link
            className="ml-1 text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all"
            to="/register"
          >
            Ro'yxatdan o'tish
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
          <span className="opacity-50">© 2026 Sentinel Inc.</span>
        </footer>
      </main>

      {/* Visual Anchor: Floating Abstract Shape */}
      <div className="fixed top-24 right-[-100px] w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-24 left-[-100px] w-80 h-80 bg-tertiary-fixed/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Login;
