import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { getAdminDashboard, getWeeklyStatistics, getRecentDangerousContent } from './_api';
import type { SystemStats, UserActivity } from '@/types/api';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface WeeklyData {
  day: string;
  count: number;
  date: string;
}

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

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserActivity[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [dangerousContent, setDangerousContent] = useState<DangerousContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDays, setSelectedDays] = useState<number>(7);

  // O'sish foizini formatlash
  const formatGrowth = (percentage: number) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  // O'sish foizi uchun rang tanlash
  const getGrowthColor = (percentage: number, isPositiveGood: boolean = true) => {
    if (percentage === 0) return 'text-slate-500 bg-slate-100';
    const isGood = isPositiveGood ? percentage > 0 : percentage < 0;
    return isGood ? 'text-primary bg-primary/5' : 'text-error bg-error/5';
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [selectedDays]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const [dashboardResponse, weeklyResponse, dangerousResponse] = await Promise.all([
        getAdminDashboard(),
        getWeeklyStatistics(selectedDays),
        getRecentDangerousContent(3),
      ]);

      if (dashboardResponse.success) {
        setStats(dashboardResponse.data.stats);
        setRecentUsers(dashboardResponse.data.recentUsers);
      }

      if (weeklyResponse.success) {
        setWeeklyData(weeklyResponse.data);
      }

      if (dangerousResponse.success) {
        setDangerousContent(dangerousResponse.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const weeklyResponse = await getWeeklyStatistics(selectedDays);
      if (weeklyResponse.success) {
        setWeeklyData(weeklyResponse.data);
      }
    } catch (err: any) {
      console.error('Statistikani yuklashda xatolik:', err);
    }
  };

  return (
    <MainLayout>
      <main className="px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Boshqaruv paneli</h1>
          <p className="text-on-surface-variant/70 font-medium">
            Tizim holati va so'nggi tahlillar haqida umumiy ma'lumot.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-error-container text-on-error-container rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg font-semibold text-on-surface-variant">Yuklanmoqda...</div>
          </div>
        ) : (
          <>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Card 1 - Jami tekshiruvlar */}
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.04)] transition-all hover:translate-y-[-4px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <span className="material-symbols-outlined text-primary text-3xl" data-icon="analytics">
                      analytics
                    </span>
                  </div>
                  {stats && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getGrowthColor(stats.analysesGrowthPercentage)}`}>
                      {formatGrowth(stats.analysesGrowthPercentage)}
                    </span>
                  )}
                </div>
                <h3 className="text-slate-500 text-sm font-semibold mb-1">Jami tekshiruvlar</h3>
                <p className="text-3xl font-extrabold text-on-surface tracking-tight">
                  {stats?.totalAnalyses.toLocaleString() || '0'}
                </p>
              </div>

              {/* Card 2 - Toksik matnlar */}
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.04)] transition-all hover:translate-y-[-4px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-error/10 rounded-2xl">
                    <span className="material-symbols-outlined text-error text-3xl" data-icon="dangerous">
                      dangerous
                    </span>
                  </div>
                  <span className="text-xs font-bold text-error bg-error/5 px-2 py-1 rounded-full">
                    {stats?.toxicContentPercentage.toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-slate-500 text-sm font-semibold mb-1">Toksik matnlar</h3>
                <p className="text-3xl font-extrabold text-on-surface tracking-tight">
                  {Math.round((stats?.totalAnalyses || 0) * (stats?.toxicContentPercentage || 0) / 100).toLocaleString()}
                </p>
              </div>

              {/* Card 3 - Faol foydalanuvchilar */}
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.04)] transition-all hover:translate-y-[-4px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-secondary/10 rounded-2xl">
                    <span className="material-symbols-outlined text-secondary text-3xl" data-icon="group">
                      group
                    </span>
                  </div>
                  {stats && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getGrowthColor(stats.usersGrowthPercentage)}`}>
                      {formatGrowth(stats.usersGrowthPercentage)}
                    </span>
                  )}
                </div>
                <h3 className="text-slate-500 text-sm font-semibold mb-1">Faol foydalanuvchilar</h3>
                <p className="text-3xl font-extrabold text-on-surface tracking-tight">
                  {stats?.totalUsers.toLocaleString() || '0'}
                </p>
              </div>

              {/* Card 4 - Moderatorlar */}
              <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.04)] transition-all hover:translate-y-[-4px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-tertiary-container/10 rounded-2xl">
                    <span className="material-symbols-outlined text-tertiary text-3xl" data-icon="admin_panel_settings">
                      admin_panel_settings
                    </span>
                  </div>
                  <span className="text-xs font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-1 rounded-full">
                    Barqaror
                  </span>
                </div>
                <h3 className="text-slate-500 text-sm font-semibold mb-1">Moderatorlar</h3>
                <p className="text-3xl font-extrabold text-on-surface tracking-tight">
                  {stats?.totalModeration.toLocaleString() || '0'}
                </p>
              </div>
            </div>

            {/* Analytics & Alerts Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="lg:col-span-2 bg-surface-container-lowest p-10 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.04)]">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold tracking-tight">Statistika</h2>
                  <select
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Number(e.target.value))}
                    className="bg-surface border-none text-sm font-medium rounded-lg px-4 py-2 text-slate-600 focus:ring-2 focus:ring-primary/20"
                  >
                    <option value={7}>Oxirgi 7 kun</option>
                    <option value={30}>Oxirgi 30 kun</option>
                  </select>
                </div>

                {/* Chart with Recharts */}
                {weeklyData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={weeklyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(53, 37, 205)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="rgb(53, 37, 205)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                        <XAxis
                          dataKey="day"
                          tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <YAxis
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          axisLine={{ stroke: '#e2e8f0' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            padding: '12px 16px',
                          }}
                          labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#e0e7ff', fontSize: '14px' }}
                          formatter={(value: any) => [`${value} ta tahlil`, 'Tekshiruvlar']}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="rgb(53, 37, 205)"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorCount)"
                          activeDot={{ r: 8, fill: 'rgb(53, 37, 205)' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="w-full text-center py-12 text-slate-400">
                    <div className="mb-2">📊</div>
                    <div>Statistika ma'lumotlari yo'q</div>
                  </div>
                )}
              </div>

              {/* Recent Alerts List */}
              <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0_20px_40px_rgba(53,37,205,0.04)]">
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined text-error" data-icon="priority_high">
                    priority_high
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight">So'nggi xavfli matnlar</h2>
                </div>

                <div className="space-y-6">
                  {dangerousContent.length > 0 ? (
                    <>
                      {dangerousContent.map((alert, idx) => {
                        // Rang belgilash
                        const getSeverityColor = () => {
                          if (alert.severity === 'Juda xavfli' || alert.toxicityScore >= 80) {
                            return 'text-error bg-error-container/50';
                          } else if (alert.severity === 'Tahdid' || alert.toxicityScore >= 60) {
                            return 'text-error bg-error-container/30';
                          } else {
                            return 'text-tertiary bg-tertiary-fixed';
                          }
                        };

                        return (
                          <div
                            key={alert.id}
                            className={`flex flex-col gap-3 ${
                              idx < dangerousContent.length - 1 ? 'pb-6 border-b border-surface-container' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${getSeverityColor()}`}>
                                {alert.severity}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">{alert.time}</span>
                            </div>
                            <p className="text-sm text-on-surface font-medium leading-relaxed">
                              <span className="italic text-slate-600">"{alert.text.substring(0, 100)}{alert.text.length > 100 ? '...' : ''}"</span>
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary">
                                  {alert.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-slate-500 font-semibold">@{alert.user.name}</span>
                              </div>
                              <div className="text-xs text-slate-400">
                                Xavfli daraja: <span className="font-bold text-error">{alert.toxicityScore}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        onClick={() => navigate('/admin/dangerous-content')}
                        className="w-full py-4 text-primary font-bold text-sm hover:bg-primary/5 rounded-xl transition-all mt-4 border border-dashed border-primary/20"
                      >
                        Barcha xavfli xabarlarni ko'rish
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <div className="mb-2 text-3xl">🛡️</div>
                      <div className="font-medium">Xavfli matnlar topilmadi</div>
                      <div className="text-xs mt-1">Hozircha hamma narsa xavfsiz</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Stats & Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-primary p-10 rounded-xl text-white flex flex-col justify-between md:col-span-1 overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1 opacity-80" style={{ color: 'var(--on-primary)' }}>Model aniqligi</h3>
                  <p className="text-5xl font-extrabold tracking-tighter">
                    98.5%
                  </p>
                </div>
                <div className="relative z-10 mt-8">
                  <p className="text-xs font-medium opacity-70 mb-4 uppercase tracking-widest">
                    Modelning ishonchli darajasi
                  </p>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `98.5%` }}></div>
                  </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-surface-container-high p-10 rounded-xl md:col-span-2 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Yangi tekshiruv boshlash</h3>
                  <p className="text-on-surface-variant max-w-md">
                    Istagan matningizni kiriting va bizning AI modelimiz uni toksiklik darajasini bir necha soniyada
                    aniqlaydi.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/check')}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-primary/90"
                >
                  Boshlash
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </MainLayout>
  );
};

export default Admin;
