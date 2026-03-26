import { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Tasdiqlash',
  cancelText = 'Bekor qilish',
  variant = 'danger',
}: ConfirmDialogProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-error text-on-error',
    warning: 'bg-tertiary text-on-tertiary',
    info: 'bg-primary text-on-primary',
  };

  const iconClasses = {
    danger: 'text-error',
    warning: 'text-tertiary',
    info: 'text-primary',
  };

  const icons = {
    danger: 'warning',
    warning: 'error',
    info: 'info',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-surface-container-low rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full ${iconClasses[variant]}/10 flex items-center justify-center mb-4`}>
            <span className={`material-symbols-outlined text-3xl ${iconClasses[variant]}`}>
              {icons[variant]}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>

          {/* Message */}
          <p className="text-slate-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg ${variantClasses[variant]} font-semibold hover:opacity-90 transition-opacity`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
