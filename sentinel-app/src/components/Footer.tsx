const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest pt-20 pb-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-6 border-t border-surface-container-high pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" data-icon="security">
                security
              </span>
              <span className="text-indigo-700 font-extrabold tracking-tighter text-xl headline-font">
                Sentinel
              </span>
            </div>
            <p className="text-on-surface-variant max-w-sm">
              Raqamli olamni yanada toza va xavfsiz qilish uchun yaratilgan sun'iy intellekt ekotizimi.
              Biz har bir foydalanuvchi huquqini himoya qilamiz.
            </p>
          </div>

          <div>
            <h4 className="font-bold headline-font mb-6">Loyihalar haqida</h4>
            <ul className="space-y-4 text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Tizim imkoniyatlari
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href={import.meta.env.VITE_API_DOCS_URL || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API hujjatlari
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Maxfiylik siyosati
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold headline-font mb-6">Qo'llab-quvvatlash</h4>
            <ul className="space-y-4 text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  support@Sentinel.uz
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Telegram bot
                </a>
              </li>
              <li>
                <p className="mt-4 font-semibold text-on-surface">
                  Muallif: <span className="text-primary">Sentinel Jamoasi</span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-on-surface-variant/60">
          <p>© 2024 Sentinel - O'zbekistonda ishlab chiqilgan.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="#">
              Twitter
            </a>
            <a className="hover:text-primary" href="#">
              GitHub
            </a>
            <a className="hover:text-primary" href="#">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
