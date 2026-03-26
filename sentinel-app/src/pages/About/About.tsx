import MainLayout from '../../components/MainLayout';

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl headline-font font-extrabold text-on-surface mb-6">
            Sentinella loyihasi haqida
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Toksik kontentni aniqlash va raqamli muhitni xavfsizroq qilish uchun ishlab chiqilgan
            zamonaviy sun'iy intellekt tizimi
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-surface-container-low rounded-xl p-8 md:p-12 mb-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="track_changes">
                track_changes
              </span>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl headline-font font-bold text-on-surface mb-4">
                Bizning maqsadimiz
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                Sentinella loyihasi ijtimoiy tarmoqlar, forum va boshqa onlayn platformalardagi toksik,
                haqoratomuz va zararli kontentni avtomatik aniqlash orqali internetni xavfsizroq va do'stona
                muhitga aylantirishni maqsad qilgan. Biz sun'iy intellekt va tabiiy tilni qayta ishlash (NLP)
                texnologiyalaridan foydalanib, foydalanuvchilarni zararli kontentdan himoya qilamiz.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface-container-low rounded-xl p-8">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="psychology">
                psychology
              </span>
            </div>
            <h3 className="text-xl headline-font font-bold text-on-surface mb-4">
              Sun'iy intellekt asosida
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Bizning tizimimiz zamonaviy mashinali o'rganish algoritmlari va chuqur neyron tarmoqlaridan
              foydalanadi. Model minglab matnlar to'plamida o'rgatilgan va 98.5% aniqlik darajasiga erishgan.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-8">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl" data-icon="language">
                language
              </span>
            </div>
            <h3 className="text-xl headline-font font-bold text-on-surface mb-4">
              Ko'p tillarni qo'llab-quvvatlash
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Sentinella o'zbek, rus, ingliz va boshqa tillardagi matnlarni tahlil qilish imkoniyatiga ega.
              Tizim kontekstni tushunib, turli xil toksiklik turlarini aniqlaydi.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl headline-font font-bold text-on-surface mb-8 text-center">
            Asosiy imkoniyatlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-2xl" data-icon="bolt">
                  bolt
                </span>
              </div>
              <h4 className="headline-font font-bold text-on-surface mb-2">Tezkor ishlash</h4>
              <p className="text-sm text-on-surface-variant">Real vaqt rejimida tahlil</p>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-2xl" data-icon="category">
                  category
                </span>
              </div>
              <h4 className="headline-font font-bold text-on-surface mb-2">Kategoriya tahlili</h4>
              <p className="text-sm text-on-surface-variant">Toksiklik turlarini aniqlash</p>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-2xl" data-icon="analytics">
                  analytics
                </span>
              </div>
              <h4 className="headline-font font-bold text-on-surface mb-2">Batafsil hisobot</h4>
              <p className="text-sm text-on-surface-variant">To'liq statistika va tahlil</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-primary rounded-xl p-8 md:p-12 text-on-primary">
          <h2 className="text-2xl md:text-3xl headline-font font-bold mb-6 text-center" style={{ color: 'var(--on-primary)' }}>
            Jamoa haqida
          </h2>
          <p className="text-center max-w-3xl mx-auto leading-relaxed opacity-90 text-lg">
            Sentinella loyihasi dasturchilar, ma'lumotlar olimlari va sun'iy intellekt mutaxassislari
            jamoasi tomonidan yaratilgan. Biz internetni barcha foydalanuvchilar uchun xavfsizroq
            joyga aylantirishga sodiqmiz.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
