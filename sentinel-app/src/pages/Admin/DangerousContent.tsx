import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { getRecentDangerousContent } from './_api';

interface DangerousContent {
  id: string;
  text: string;
  severity: string;
  toxicityScore: number;
  time: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const DangerousContent = () => {
  const navigate = useNavigate();
  const [dangerousContent, setDangerousContent] = useState<DangerousContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    loadDangerousContent();
  }, [limit]);

  const loadDangerousContent = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getRecentDangerousContent(limit);

      if (response.success) {
        setDangerousContent(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string, score: number) => {
    if (severity === 'Juda xavfli' || score >= 80) {
      return 'text-error bg-error-container/50';
    } else if (severity === 'Tahdid' || score >= 60) {
      return 'text-error bg-error-container/30';
    } else {
      return 'text-tertiary bg-tertiary-fixed';
    }
  };

  return (
    <MainLayout>
      <main className="px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-medium">Admin paneliga qaytish</span>
          </button>
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
            Barcha xavfli xabarlar
          </h1>
          <p className="text-on-surface-variant/70 font-medium">
            Tizimda aniqlangan barcha xavfli matnlar ro'yxati.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-xl">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-error text-2xl">dangerous</span>
              <h3 className="text-sm font-semibold text-slate-500">Jami xavfli matnlar</h3>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">{dangerousContent.length}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-error text-2xl">priority_high</span>
              <h3 className="text-sm font-semibold text-slate-500">Juda xavfli</h3>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">
              {dangerousContent.filter((item) => item.toxicityScore >= 80).length}
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-tertiary text-2xl">warning</span>
              <h3 className="text-sm font-semibold text-slate-500">O'rtacha xavfli</h3>
            </div>
            <p className="text-3xl font-extrabold text-on-surface">
              {dangerousContent.filter((item) => item.toxicityScore >= 60 && item.toxicityScore < 80).length}
            </p>
          </div>
        </div>

        {/* Load More Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setLimit(20)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              limit === 20 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            20 ta
          </button>
          <button
            onClick={() => setLimit(50)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              limit === 50 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            50 ta
          </button>
          <button
            onClick={() => setLimit(100)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              limit === 100 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            100 ta
          </button>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg font-semibold text-on-surface-variant">Yuklanmoqda...</div>
          </div>
        ) : dangerousContent.length > 0 ? (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-surface-container">
              {dangerousContent.map((item, idx) => (
                <div key={item.id} className="p-6 hover:bg-surface-container/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-sm">#{idx + 1}</span>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded ${getSeverityColor(item.severity, item.toxicityScore)}`}>
                        {item.severity}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {item.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-600 font-medium">@{item.user.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 mb-1">Xavflilik darajasi</div>
                        <div className="text-lg font-bold text-error">{item.toxicityScore}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">{item.time}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed bg-surface-container/50 p-4 rounded-lg">
                    <span className="italic text-slate-700">"{item.text}"</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
            <div className="mb-4 text-5xl">🛡️</div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Xavfli matnlar topilmadi</h3>
            <p className="text-slate-500">Hozircha hamma narsa xavfsiz ko'rinadi</p>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default DangerousContent;
