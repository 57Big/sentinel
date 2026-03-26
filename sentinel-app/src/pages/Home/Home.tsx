import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';

const Home = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-4xl md:text-6xl headline-font font-extrabold text-on-surface tracking-tight leading-tight">
            Matnli ma'lumotlarda{' '}
            <span className="text-primary">toksik kontentni</span> aniqlash tizimi
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Xavfsiz va toza raqamli muhit uchun sun'iy intellekt tahlili. Bizning ilg'or algoritmlarimiz
            matndagi nafrat, haqorat va zararli kontentni soniyalarda aniqlaydi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate('/check')}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Tekshirishni boshlash
            </button>
            <button
              onClick={() => navigate('/about')}
              className="bg-surface-container-low text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface-container-high transition-colors"
            >
              Loyiha haqida
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="aspect-square rounded-xl overflow-hidden shadow-2xl relative group">
            <img
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              alt="Abstract 3D visualization of digital security"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYC1HCXZ8TZi2hwsgX6095AdlEbvQLL7pcNtXHhIIw3gk4CjgA_s2hzfr1HCiq52p3UbBnLJlWwgPqOAfAJoUL3H_NVsibRPhdbkNwo2XpdMyuMwehT0pu-fpeWZVIB8cem7YVDuIsV9zH_mbV_b8KSOUbDbT1EB-Dak6HaBIxjsq1C-oXIOuZx4PbDFaw99XDu1DCeJcl-Znq4rK59PlvINR3qbvM5eGh5YJ4xpjV2MMJ2AGKYOJEb4bAVluGSNh23JMibLFl5d0"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-lg shadow-xl border border-outline-variant/10 hidden lg:block backdrop-blur-md bg-white/90">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-error"
                  data-icon="warning"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
              </div>
              <div>
                <p className="text-sm font-bold headline-font">Toksiklik aniqlandi</p>
                <p className="text-xs text-on-surface-variant">Aniqlik ko'rsatkichi: 99.4%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-surface-container-low p-10 rounded-xl hover:bg-surface-container-lowest transition-all group border border-transparent hover:border-outline-variant/20 hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="bolt">
                bolt
              </span>
            </div>
            <h3 className="text-2xl headline-font font-bold mb-4">Tezkor tahlil</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Matnlarni real vaqt rejimida tekshiring. Sun'iy intellektimiz har bir so'zni millisoniyalarda
              qayta ishlaydi.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-surface-container-low p-10 rounded-xl hover:bg-surface-container-lowest transition-all group border border-transparent hover:border-outline-variant/20 hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="verified_user">
                verified_user
              </span>
            </div>
            <h3 className="text-2xl headline-font font-bold mb-4">Yuqori aniqlik</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Zamonaviy NLP modellari yordamida kontekstni tushunish va xatoliklarni minimal darajaga tushirish.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-surface-container-low p-10 rounded-xl hover:bg-surface-container-lowest transition-all group border border-transparent hover:border-outline-variant/20 hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="touch_app">
                touch_app
              </span>
            </div>
            <h3 className="text-2xl headline-font font-bold mb-4">Oson foydalanish</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Oddiy va intuitiv interfeys. Hech qanday murakkab sozlamalarsiz matnni kiriting va natijani oling.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-primary rounded-xl p-12 md:p-20 text-on-primary relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold headline-font">1M+</p>
              <p className="text-sm uppercase tracking-widest opacity-80">Tekshirilgan matnlar</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold headline-font">98.5%</p>
              <p className="text-sm uppercase tracking-widest opacity-80">Aniqlik darajasi</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold headline-font">24/7</p>
              <p className="text-sm uppercase tracking-widest opacity-80">Monitoring</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold headline-font">100+</p>
              <p className="text-sm uppercase tracking-widest opacity-80">Hamkorlar</p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
