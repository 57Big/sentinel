import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { analyzeText, getUserAnalysisHistory } from './_api';
import type { ToxicityAnalysisResult, ResultItem } from '@/types/api';

const Check = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ToxicityAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<ResultItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Tarixni yuklash
  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const response = await getUserAnalysisHistory({
          page: 1,
          pageSize: 3,
          sortBy: 'analyzedAt',
          sortOrder: 'desc'
        });

        if (response.success && response.data) {
          setHistory(response.data.results);
        }
      } catch (err) {
        console.error('Tarixni yuklashda xatolik:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Vaqtni formatlash funksiyasi
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      return 'Bir necha daqiqa avval';
    } else if (diffInHours < 24) {
      return `${diffInHours} soat avval`;
    } else if (diffInDays === 1) {
      return 'Kecha';
    } else if (diffInDays < 7) {
      return `${diffInDays} kun avval`;
    } else {
      return date.toLocaleDateString('uz-UZ');
    }
  };

  // Toxicity level ni formatlash
  const formatToxicityLevel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'xavfsiz': 'Xavfsiz',
      'shubhali': 'Shubhali',
      'toksik': 'Toksik'
    };
    return levelMap[level.toLowerCase()] || level;
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Iltimos, tahlil qilish uchun matn kiriting');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await analyzeText({ text });

      if (response.success) {
        setResult(response.data);
        // Tahlil muvaffaqiyatli bo'lgandan so'ng tarixni yangilash
        const historyResponse = await getUserAnalysisHistory({
          page: 1,
          pageSize: 3,
          sortBy: 'analyzedAt',
          sortOrder: 'desc'
        });
        if (historyResponse.success && historyResponse.data) {
          setHistory(historyResponse.data.results);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Tahlil qilishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <main className="px-6 md:px-20 lg:px-24 max-w-7xl mx-auto">
        {/* Hero Section / Context */}
        <div className="mb-12">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-3">
            Matn Tahlili
          </h1>
          <p className="text-on-surface-variant font-body max-w-2xl leading-relaxed">
            Sun'iy intellekt yordamida matndagi toksiklik, nafrat tili va haqoratomuz mazmunni bir zumda aniqlang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Analysis Area */}
          <section className="lg:col-span-8 space-y-8">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(53,37,205,0.04)] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <label className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary" data-icon="edit_note">
                    edit_note
                  </span>
                  Tekshiriladigan matn
                </label>
                <span className="text-xs font-label font-medium bg-surface-container-high px-3 py-1 rounded-full text-outline">
                  {text.length} / 5000 belgilar
                </span>
              </div>

              <div className="relative group">
                <textarea
                  className="w-full h-64 bg-surface-container-low border-none rounded-xl p-6 font-body text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all resize-none text-lg leading-relaxed"
                  placeholder="Tahlil qilish uchun matnni kiriting..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-error-container text-on-error-container rounded-xl">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg" data-icon="language">
                      language
                    </span>
                    <span className="text-sm font-label">O'zbek tili</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg" data-icon="auto_awesome">
                      auto_awesome
                    </span>
                    <span className="text-sm font-label">AI Modeli: Sentinel-v2</span>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="bg-primary hover:bg-primary-container text-white px-10 py-4 rounded-xl font-headline font-bold tracking-wide transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
                  <span
                    className="material-symbols-outlined"
                    data-icon="bolt"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Agressivlik */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary" data-icon="thunderstorm">
                        thunderstorm
                      </span>
                      <span className="font-headline font-bold text-on-surface">Agressivlik</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-primary">
                        {result.aggressionScore ?? 0}
                      </span>
                      <span className="text-sm font-bold text-outline">%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${result.aggressionScore ?? 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Haqorat */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-error shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-error" data-icon="gavel">
                        gavel
                      </span>
                      <span className="font-headline font-bold text-on-surface">Haqorat</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-error">
                        {result.offenseScore ?? 0}
                      </span>
                      <span className="text-sm font-bold text-outline">%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full">
                      <div
                        className="h-full bg-error rounded-full"
                        style={{ width: `${result.offenseScore ?? 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tahdid */}
                <div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-secondary shadow-sm">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary" data-icon="crisis_alert">
                        crisis_alert
                      </span>
                      <span className="font-headline font-bold text-on-surface">Tahdid</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-secondary">
                        {result.threatScore ?? 0}
                      </span>
                      <span className="text-sm font-bold text-outline">%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${result.threatScore ?? 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar / Recent Checks */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline font-bold text-xl text-on-surface">Oldingi tekshiruvlar</h2>
                <span
                  className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors"
                  data-icon="history"
                >
                  history
                </span>
              </div>

              <div className="space-y-4">
                {historyLoading ? (
                  <div className="text-center py-8">
                    <span className="text-outline">Yuklanmoqda...</span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-outline">Hozircha tahlil tarixi yo'q</span>
                  </div>
                ) : (
                  history.map((item) => {
                    const level = formatToxicityLevel(item.toxicityLevel);
                    return (
                      <div
                        key={item.id}
                        className="bg-surface-container-lowest p-5 rounded-lg border border-transparent hover:border-primary/10 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                              level === 'Toksik'
                                ? 'bg-error-container text-on-error-container'
                                : level === 'Xavfsiz'
                                ? 'bg-surface-container text-secondary'
                                : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                            }`}
                          >
                            {level}
                          </span>
                          <span className="text-[10px] text-outline font-label">{formatTime(item.analyzedAt)}</span>
                        </div>
                        <p className="text-sm font-body text-on-surface line-clamp-2 mb-3 leading-relaxed">
                          {item.text}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                level === 'Toksik' ? 'bg-error' : level === 'Xavfsiz' ? 'bg-secondary' : 'bg-tertiary'
                              }`}
                              style={{ width: `${item.toxicityScore}%` }}
                            ></div>
                          </div>
                          <span className={`text-[10px] font-bold ${
                            level === 'Toksik' ? 'text-error' : level === 'Xavfsiz' ? 'text-secondary' : 'text-tertiary'
                          }`}>
                            {item.toxicityScore}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => navigate('/results')}
                className="w-full mt-6 py-3 text-sm font-headline font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
              >
                Barchasini ko'rish
              </button>
            </div>

            <div
              onClick={() => navigate('/about')}
              className="relative overflow-hidden rounded-xl bg-primary h-48 flex flex-col justify-end p-6 group cursor-pointer"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700"
                alt="Security background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkyXb5yXbHYAyZZdufFVNt1VC895XHsvdqc43I6uDIhaBWs4l-ShVkxXy_qnusg64BwPSFdl_msU_vbjAj8qa67KJXZZAGgjVLjtriuR_M04_ZETMYQrRtOmmqZvDPvIEdMWuE6Pqzr3yOPNJe24N0sCvQwgZ4zv1jkczwE-r_CwCuG0Bv_SILH4g29EAPKkpBJTzy-jdcqcbHvSDQ0u-D0X0R9BOoevqL_9I-5f3bDh8zugH62vsDBkBfjpMCTye5f4Jwcu1pitI"
              />
              <div className="relative z-10">
                <h4 className="text-white font-headline font-bold text-lg leading-tight mb-1">
                  Xavfsizlik hisoboti
                </h4>
                <p className="text-on-primary-container text-xs font-body opacity-80 mb-4">
                  Sizning haftalik tahlil ko'rsatkichlaringiz tayyor.
                </p>
                <span className="inline-flex items-center gap-2 text-white text-xs font-bold px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg">
                  Ko'rib chiqish{' '}
                  <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
};

export default Check;
