import { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getModerationList, moderateItem, getModerationStats, deleteModerationItem } from './_api';
import type { ModerationItem } from '@/types/api';

const Moderation = () => {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState<'all' | 'toxic' | 'suspicious'>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  useEffect(() => {
    loadModerationData();
    loadStats();
  }, [filter, page]);

  const loadModerationData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getModerationList({
        page,
        pageSize,
        status: filter === 'all' ? undefined : filter,
      });

      if (response.success) {
        setItems(response.data.items);
        setTotal(response.data.total);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getModerationStats();
      setStats(statsData);
    } catch (err) {
      console.error('Statistikani yuklashda xatolik:', err);
    }
  };

  const handleModerate = async (itemId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await moderateItem({ itemId, action, notes });

      if (response.success) {
        loadModerationData();
        loadStats();
        setSelectedItem(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleViewDetails = (item: ModerationItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (item: ModerationItem) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const handleApproveClick = (item: ModerationItem) => {
    setSelectedItem(item);
    setShowApproveConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteModerationItem(selectedItem.id);
        loadModerationData();
        loadStats();
        setSelectedItem(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const confirmApprove = () => {
    if (selectedItem) {
      handleModerate(selectedItem.id, 'approve', 'Admin tomonidan tasdiqlandi');
    }
  };

  const getToxicityBadgeClass = (level: string) => {
    switch (level) {
      case 'toksik':
        return 'bg-error-container text-on-error-container';
      case 'shubhali':
        return 'bg-tertiary-fixed text-on-tertiary-fixed';
      default:
        return 'bg-surface-container text-on-surface-variant';
    }
  };

  const getBorderColor = (level: string) => {
    switch (level) {
      case 'toksik':
        return 'border-error';
      case 'shubhali':
        return 'border-tertiary';
      default:
        return 'border-indigo-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-error';
    if (score >= 40) return 'text-tertiary';
    return 'text-primary';
  };

  // Pagination helper
  const totalPages = Math.ceil(total / pageSize);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maksimal ko'rsatiladigan sahifalar soni

    if (totalPages <= maxVisible) {
      // Agar jami sahifalar kam bo'lsa, hammasini ko'rsat
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Aks holda, smart pagination
      if (page <= 3) {
        // Boshida
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Oxirida
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // O'rtada
        pages.push(1);
        pages.push('...');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-6 lg:px-20">
        {/* Header & Statistics Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                Moderatsiya kutilayotgan matnlar
              </h2>
              <p className="text-slate-500 max-w-2xl leading-relaxed">
                Tizim tomonidan aniqlangan shubhali va toksik mazmundagi matnlarni ko'rib chiqing va tegishli
                choralarni ko'ring.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-surface-container-low px-6 py-4 rounded-xl flex items-center gap-4">
                <div className="p-2 bg-error-container text-on-error-container rounded-lg">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div>
                  <span className="block text-sm text-slate-500">Jami Toksik</span>
                  <span className="text-xl font-bold">{total} ta</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Chips Section */}
        <section className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => {
              setFilter('all');
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 ${
              filter === 'all'
                ? 'bg-primary text-on-primary shadow-lg shadow-indigo-500/20'
                : 'bg-surface-container-lowest border border-outline-variant/30 text-slate-600 hover:bg-surface-container'
            }`}
          >
            Hammasi
          </button>
          <button
            onClick={() => {
              setFilter('toxic');
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              filter === 'toxic'
                ? 'bg-primary text-on-primary shadow-lg shadow-indigo-500/20'
                : 'bg-surface-container-lowest border border-outline-variant/30 text-slate-600 hover:bg-error-container hover:text-on-error-container'
            }`}
          >
            Toksik
          </button>
          <button
            onClick={() => {
              setFilter('suspicious');
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-full font-medium transition-all ${
              filter === 'suspicious'
                ? 'bg-primary text-on-primary shadow-lg shadow-indigo-500/20'
                : 'bg-surface-container-lowest border border-outline-variant/30 text-slate-600 hover:bg-tertiary-fixed hover:text-on-tertiary-fixed'
            }`}
          >
            Shubhali
          </button>
          <div className="ml-auto flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-sm">sort</span>
            <span className="text-sm font-medium">Saralash: Eng yangi</span>
          </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-lg font-semibold text-on-surface-variant">Yuklanmoqda...</div>
          </div>
        ) : (
          <>
            {/* Moderation List */}
            <div className="grid grid-cols-1 gap-6">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-on-surface-variant text-lg">Elementlar topilmadi</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <article
                    key={item.id}
                    className={`bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-4 ${getBorderColor(
                      item.toxicityLevel
                    )} transition-all hover:shadow-xl hover:translate-x-1 group`}
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full ${getToxicityBadgeClass(
                              item.toxicityLevel
                            )} text-xs font-bold uppercase tracking-wider`}
                          >
                            {item.toxicityLevel === 'toksik'
                              ? 'Toksik'
                              : item.toxicityLevel === 'shubhali'
                              ? 'Shubhali'
                              : 'Tekshiruvda'}
                          </span>
                          <span className="text-sm text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                            {new Date(item.submittedAt).toLocaleDateString('uz-UZ', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}{' '}
                            •{' '}
                            {new Date(item.submittedAt).toLocaleTimeString('uz-UZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-on-surface leading-relaxed text-lg font-medium mb-4 line-clamp-3">
                          "{item.content}"
                        </p>
                        {item.submittedBy && (
                          <p className="text-sm text-slate-400">
                            <strong>Yubordi:</strong> {item.submittedBy}
                          </p>
                        )}
                      </div>

                      <div className="lg:w-72 flex flex-col justify-between items-end gap-6">
                        <div className="text-right">
                          <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                            Toksiklik darajasi
                          </span>
                          <span
                            className={`text-4xl font-headline font-extrabold ${getScoreColor(
                              item.toxicityScore
                            )}`}
                          >
                            {item.toxicityScore}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full lg:w-auto">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant font-semibold text-sm hover:bg-surface-dim transition-colors"
                          >
                            Batafsil
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="flex-1 lg:flex-none px-4 py-2 rounded-lg bg-error text-on-error font-semibold text-sm hover:opacity-90 transition-colors"
                          >
                            O'chirish
                          </button>
                          <button
                            onClick={() => handleApproveClick(item)}
                            className="flex-1 lg:flex-none p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all"
                            title="Tasdiqlash"
                          >
                            <span className="material-symbols-outlined">check</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {item.reviewedBy && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/20">
                        <p className="text-sm text-on-surface-variant">
                          <strong>Ko'rib chiqdi:</strong> {item.reviewedBy}
                        </p>
                        {item.reviewNotes && (
                          <p className="text-sm text-on-surface-variant mt-2">
                            <strong>Izoh:</strong> {item.reviewNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>

            {/* Pagination */}
            {items.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="text-sm text-slate-500">
                  Jami {total} ta element, {totalPages} sahifa
                </div>
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg hover:bg-surface-container transition-colors text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>

                  {getPageNumbers().map((pageNum, idx) => {
                    if (pageNum === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }

                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum as number)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-on-primary font-bold'
                            : 'hover:bg-surface-container text-slate-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg hover:bg-surface-container transition-colors text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Batafsil ma'lumot"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Matn */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Matn
              </h4>
              <p className="text-lg text-on-surface leading-relaxed bg-surface-container p-4 rounded-lg">
                "{selectedItem.content}"
              </p>
            </div>

            {/* Toksiklik darajasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Toksiklik darajasi
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${getScoreColor(selectedItem.toxicityScore)}`}>
                    {selectedItem.toxicityScore}%
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${getToxicityBadgeClass(
                      selectedItem.toxicityLevel
                    )} text-xs font-bold uppercase`}
                  >
                    {selectedItem.toxicityLevel === 'toksik'
                      ? 'Toksik'
                      : selectedItem.toxicityLevel === 'shubhali'
                      ? 'Shubhali'
                      : 'Tekshiruvda'}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Status
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      selectedItem.status === 'pending'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : selectedItem.status === 'approved'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {selectedItem.status === 'pending'
                      ? 'Kutilmoqda'
                      : selectedItem.status === 'approved'
                      ? 'Tasdiqlangan'
                      : 'Rad etilgan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Yuboruvchi */}
            <div className="bg-surface-container p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Ma'lumotlar
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Yubordi:</span>
                  <span className="font-medium text-on-surface">{selectedItem.submittedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Yuborilgan vaqt:</span>
                  <span className="font-medium text-on-surface">
                    {new Date(selectedItem.submittedAt).toLocaleString('uz-UZ', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {selectedItem.reviewedBy && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ko'rib chiqdi:</span>
                      <span className="font-medium text-on-surface">{selectedItem.reviewedBy}</span>
                    </div>
                    {selectedItem.reviewedAt && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ko'rib chiqilgan vaqt:</span>
                        <span className="font-medium text-on-surface">
                          {new Date(selectedItem.reviewedAt).toLocaleString('uz-UZ', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Izohlar */}
            {selectedItem.reviewNotes && (
              <div className="bg-surface-container p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Moderator izohi
                </h4>
                <p className="text-on-surface">{selectedItem.reviewNotes}</p>
              </div>
            )}

            {/* Actions */}
            {selectedItem.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDeleteClick(selectedItem);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-error text-on-error font-semibold hover:opacity-90 transition-opacity"
                >
                  O'chirish
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleApproveClick(selectedItem);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
                >
                  Tasdiqlash
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Elementni o'chirish"
        message={`"${selectedItem?.content?.substring(0, 50)}..." matnini o'chirishga ishonchingiz komilmi? Bu amalni bekor qilib bo'lmaydi.`}
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
        variant="danger"
      />

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={confirmApprove}
        title="Elementni tasdiqlash"
        message={`"${selectedItem?.content?.substring(0, 50)}..." matnini tasdiqlashga ishonchingiz komilmi? Bu matn xavfsiz deb belgilanadi.`}
        confirmText="Ha, tasdiqlash"
        cancelText="Bekor qilish"
        variant="info"
      />
    </MainLayout>
  );
};

export default Moderation;
