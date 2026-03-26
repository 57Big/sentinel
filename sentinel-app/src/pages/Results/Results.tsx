import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import { getResults, getAllResults } from './_api';
import type { ResultItem } from '@/types/api';

const Results = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedResult, setSelectedResult] = useState<ResultItem | null>(null);

  // Admin uchun barcha natijalarni ko'rsatish
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';
  const pageSize =3; 

  useEffect(() => {
    loadResults();
  }, [page, isAdmin]);

  const loadResults = async () => {
    setLoading(true);
    setError('');

    try {
      // Admin bo'lsa barcha natijalarni olish, yo'qsa faqat o'ziniki
      const apiCall = isAdmin ? getAllResults : getResults;

      const response = await apiCall({
        page,
        pageSize,
        sortBy: 'analyzedAt',
        sortOrder: 'desc',
      });

      if (response.success) {
        setResults(response.data.results);
        setTotal(response.data.total);
        if (response.data.results.length > 0 && !selectedResult) {
          setSelectedResult(response.data.results[0]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getToxicityLevel = (score: number) => {
    if (score >= 70) return 'Toksik';
    if (score >= 40) return 'Shubhali';
    return 'Xavfsiz';
  };

  const getToxicityColor = (score: number) => {
    if (score >= 70) return 'error';
    if (score >= 40) return 'tertiary';
    return 'secondary';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <MainLayout>
      <main className="px-6 max-w-5xl mx-auto min-h-screen">
        {/* Admin mode banner */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl" data-icon="admin_panel_settings">
              admin_panel_settings
            </span>
            <div>
              <h3 className="font-bold text-primary">Admin rejimi</h3>
              <p className="text-sm text-on-surface-variant">Siz barcha foydalanuvchilarning natijalarini ko'rishingiz mumkin</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg font-semibold text-on-surface-variant">Yuklanmoqda...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg mb-4">Hozircha tahlil natijalari yo'q</p>
            <a
              href="/check"
              className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors"
            >
              Birinchi tahlilni boshlash
            </a>
          </div>
        ) : (
          <>
            {/* Result Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Analysis Sidebar: Summary Card */}
              <aside className="lg:col-span-4 space-y-6">
                {selectedResult && (
                  <>
                    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.06)] border border-outline-variant/10">
                      <h2 className="font-headline font-bold text-2xl tracking-tight text-on-surface mb-6">
                        Tahlil natijasi
                      </h2>

                      {/* Main Status Badge */}
                      <div className="mb-8">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${getToxicityColor(
                            selectedResult.toxicityScore
                          )}-container text-on-${getToxicityColor(
                            selectedResult.toxicityScore
                          )}-container font-semibold text-sm`}
                        >
                          <span
                            className="material-symbols-outlined text-sm"
                            data-icon="warning"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {selectedResult.toxicityScore >= 70 ? 'warning' : 'info'}
                          </span>
                          <span>{getToxicityLevel(selectedResult.toxicityScore)}</span>
                        </div>
                        <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                          {selectedResult.toxicityScore >= 70
                            ? 'Matnda zararli mazmun va boshqalarni kamsituvchi ifodalar aniqlandi.'
                            : selectedResult.toxicityScore >= 40
                            ? 'Matnda shubhali ifodalar aniqlandi.'
                            : 'Matn xavfsiz deb topildi.'}
                        </p>
                      </div>

                      {/* Sentiment Gauge */}
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="flex justify-between items-end mb-2">
                            <span className="font-label text-xs font-bold uppercase tracking-widest text-outline">
                              Toksiklik darajasi
                            </span>
                            <span className="font-headline font-extrabold text-3xl text-primary">
                              {selectedResult.toxicityScore}%
                            </span>
                          </div>
                          <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                              style={{ width: `${selectedResult.toxicityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
                      <h3 className="font-label font-bold text-xs uppercase tracking-widest text-outline mb-4">
                        Tafsilotlar
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-on-surface-variant">Sana:</span>
                          <span className="text-sm font-semibold">
                            {new Date(selectedResult.analyzedAt).toLocaleDateString('uz-UZ', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-on-surface-variant">Vaqt:</span>
                          <span className="text-sm font-semibold">
                            {new Date(selectedResult.analyzedAt).toLocaleTimeString('uz-UZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-on-surface-variant">ID:</span>
                          <span className="text-sm font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                            #{selectedResult.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </aside>

              {/* Main Content: Analyzed Text & Detailed Scores */}
              <div className="lg:col-span-8 space-y-8">
                {selectedResult && (
                  <>
                    {/* Text Content Analyzed Box */}
                    <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
                      <div className="bg-surface-container px-8 py-4 flex items-center justify-between">
                        <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          Tahlil qilingan matn
                        </span>
                        <button
                          className="material-symbols-outlined text-outline hover:text-primary transition-colors"
                          data-icon="content_copy"
                          onClick={() => copyToClipboard(selectedResult.text)}
                        >
                          content_copy
                        </button>
                      </div>
                      <div className="p-8">
                        <p className="text-lg leading-relaxed font-body text-on-surface italic">
                          "{selectedResult.text}"
                        </p>
                      </div>
                    </section>

                    {/* Detailed Scores Bento Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                              {selectedResult.toxicityScore}
                            </span>
                            <span className="text-sm font-bold text-outline">%</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container rounded-full">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${selectedResult.toxicityScore}%` }}
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
                              {Math.min(selectedResult.toxicityScore + 10, 100)}
                            </span>
                            <span className="text-sm font-bold text-outline">%</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container rounded-full">
                            <div
                              className="h-full bg-error rounded-full"
                              style={{ width: `${Math.min(selectedResult.toxicityScore + 10, 100)}%` }}
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
                              {Math.max(selectedResult.toxicityScore - 20, 0)}
                            </span>
                            <span className="text-sm font-bold text-outline">%</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-container rounded-full">
                            <div
                              className="h-full bg-secondary rounded-full"
                              style={{ width: `${Math.max(selectedResult.toxicityScore - 20, 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                      <a
                        href="/check"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 active:scale-95 transition-all duration-200"
                      >
                        <span className="material-symbols-outlined" data-icon="refresh">
                          refresh
                        </span>
                        Yana tekshirish
                      </a>
                      <button className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest text-on-surface-variant font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-surface-dim active:scale-95 transition-all duration-200">
                        <span className="material-symbols-outlined" data-icon="flag">
                          flag
                        </span>
                        Xabar berish
                      </button>
                    </div>
                  </>
                )}

                {/* Results List */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline font-bold text-xl text-on-surface">
                      {isAdmin ? "Barcha natijalar (Admin)" : "Mening natijalarim"}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-on-surface-variant">
                        Jami: <span className="font-bold text-primary">{total}</span> ta natija
                      </span>
                      {isAdmin && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-bold">Admin</span>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => setSelectedResult(result)}
                        className={`bg-surface-container-lowest p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                          selectedResult?.id === result.id
                            ? 'border-primary shadow-md'
                            : 'border-outline-variant/10'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                              result.toxicityScore >= 70
                                ? 'bg-error-container text-on-error-container'
                                : result.toxicityScore >= 40
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                                : 'bg-surface-container text-secondary'
                            }`}
                          >
                            {getToxicityLevel(result.toxicityScore)}
                          </span>
                          <span className="text-[10px] text-outline font-label">
                            {new Date(result.analyzedAt).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                        <p className="text-sm font-body text-on-surface line-clamp-2 mb-3 leading-relaxed">
                          {result.text}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                result.toxicityScore >= 70
                                  ? 'bg-error'
                                  : result.toxicityScore >= 40
                                  ? 'bg-tertiary'
                                  : 'bg-secondary'
                              }`}
                              style={{ width: `${result.toxicityScore}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              result.toxicityScore >= 70
                                ? 'text-error'
                                : result.toxicityScore >= 40
                                ? 'text-tertiary'
                                : 'text-secondary'
                            }`}
                          >
                            {result.toxicityScore}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {Math.ceil(total / pageSize) > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl flex items-center gap-2 hover:bg-surface-dim active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined" data-icon="chevron_left">
                          chevron_left
                        </span>
                        Oldingi
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-on-surface-variant">
                          Sahifa <span className="font-bold text-primary">{page}</span> /{' '}
                          <span className="font-bold">{Math.ceil(total / pageSize)}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / pageSize)))}
                        disabled={page >= Math.ceil(total / pageSize)}
                        className="px-6 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl flex items-center gap-2 hover:bg-surface-dim active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Keyingi
                        <span className="material-symbols-outlined" data-icon="chevron_right">
                          chevron_right
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
};

export default Results;
