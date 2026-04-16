# Sentinella - Toksik Kontent Moderatsiya Tizimi

## Loyihaning maqsadi

Sentinella loyihasi zamonaviy sun'iy intellekt texnologiyalari asosida o'zbek tilidagi matnlarning toksiklik darajasini avtomatik aniqlash va moderatsiya qilish uchun mo'ljallangan web-ilovasi hisoblanadi. Tizim OpenAI GPT-4o-mini modelidan foydalanib, matnlarni real-time rejimida tahlil qiladi va ularning xavflilik darajasini baholaydi.

Loyihaning asosiy maqsadi ijtimoiy tarmoqlar, forum, chat ilovalar va boshqa onlayn platformalarda toksik kontentni avtomatik aniqlash va filtrlash jarayonini soddalashtirish hamda samaradorligini oshirishdir. Bu tizim moderatorlar va administratorlar ish yukini kamaytirish bilan birga, foydalanuvchilar uchun xavfsiz raqamli muhitni ta'minlaydi.

---

## Qaysi muammoni hal qiladi

### 1. Toksik kontent muammosi

Zamonaviy raqamli muhitda toksik kontent muammosi tobora dolzarb bo'lib bormoqda. Toksik kontent quyidagi turlarni o'z ichiga oladi:

- **Haqoratomuz xabarlar** - boshqalarni kamsituvchi, tahqirlovchi iboralar
- **Tajovuz va agressivlik** - zo'ravonlikka undovchi, qo'rqituvchi matnlar
- **Tahdid va qo'rqitish** - shaxsiy xavfsizlikka xavf tug'diruvchi bayonotlar
- **Noto'g'ri axborot tarqatish** - yolg'on, fitnachi kontentlar

### 2. An'anaviy moderatsiya usullarining cheklovlari

An'anaviy qo'lda moderatsiya qilish usuli quyidagi muammolarni keltirib chiqaradi:

- **Vaqt va resurs talablari** - katta hajmdagi kontentni nazorat qilish uchun ko'p son moderatorlar zarur
- **Inson faktori** - moderatorlarning charchoqligi, sub'ektivligi va xatolari
- **Kechikishlar** - xavfli kontentni vaqtida aniqlash va olib tashlashda kechikishlar
- **Miqyoslash qiyinchiliklari** - foydalanuvchilar soni va kontent hajmi ortishi bilan tizimni kengaytirish murakkabligi
- **Psixologik ta'sir** - moderatorlarning doimiy ravishda toksik kontent bilan ishlashi natijasida ruhiy salomatlikka salbiy ta'siri

### 3. O'zbek tili uchun maxsus yechim zarurligi

Aksariyat mavjud toksiklik aniqlash tizimlari ingliz tili uchun ishlab chiqilgan bo'lib, o'zbek tilidagi kontentni samarali tahlil qila olmaydi. O'zbek tili uchun alohida yechim kerak, chunki:

- **Tilning o'ziga xos xususiyatlari** - o'zbek tili morfologik jihatdan boy til
- **Madaniy kontekst** - toksiklik tushunchasi har bir madaniyatda o'ziga xos
- **Lotin va kirill alifbolari** - o'zbek tilida ikki xil yozuv tizimi mavjudligi qo'shimcha murakkablik yaratadi

---

## Foydalanuvchi uchun foydalar

### 1. Platformalar uchun foydalar

**Ijtimoiy tarmoqlar va onlayn hamjamiyatlar:**
- Avtomatik moderatsiya orqali operatsion xarajatlarni 60-70% gacha kamaytirish
- Real-time tahlil orqali toksik kontentni darhol aniqlash va bloklash
- Foydalanuvchilar uchun xavfsiz va do'stona muhit yaratish
- Platformaning obro'si va ishonchliligini oshirish

**Ta'lim tizimlari va onlayn kurslar:**
- O'quvchilar va talabalar o'rtasidagi muloqotni nazorat qilish
- Kiberbullying (onlayn zo'ravonlik) holatlarini profilaktika qilish
- Pedagogik xodimlar vaqtini samarali boshqarish

**Korporativ kommunikatsiya platformalari:**
- Xodimlar o'rtasidagi professional muloqot standartlarini saqlash
- Kompaniya ichidagi konfliktlar va nizo holatlarini oldini olish
- Ishbilarmonlik etikasi talablariga rioya qilishni ta'minlash

### 2. Moderatorlar uchun foydalar

- **Avtomatik filtrlash** - toksik kontentning 80-90% i avtomatik ravishda aniqlanadi va ishlov beriladi
- **Prioritetlash tizimi** - eng xavfli kontentlar birinchi navbatda ko'rib chiqiladi
- **Analitik ma'lumotlar** - batafsil statistika va hisobotlar orqali tendentsiyalarni kuzatish imkoniyati
- **Ish yukini kamaytirish** - AI yordamchisi murakkab vazifalarni hal qiladi, moderator faqat muhim qarorlar qabul qiladi

### 3. Foydalanuvchilar uchun foydalar

- **Xavfsiz muloqot muhiti** - toksik kontentdan himoyalangan platformada ishonchli aloqa
- **Tezkor javob** - xavfli xabarlar real-time rejimida bloklanadi
- **Oshkoralik va adolat** - barcha xabarlar bir xil mezonlar bo'yicha tekshiriladi
- **Ruhiy salomatlik** - stressli va zararli kontentdan himoyalanish

### 4. Administrator va tizim egasi uchun foydalar

- **To'liq nazorat** - tizim ishlashini real-time monitoring qilish
- **Batafsil statistika** - haftalik, oylik va yillik hisobotlar
- **Moslashuvchanlik** - toksiklik chegaralarini sozlash imkoniyati
- **Miqyoslanuvchi arxitektura** - foydalanuvchilar sonining o'sishi bilan birga tizimni kengaytirish

---

## Tizimning asosiy imkoniyatlari (Features)

### 1. Autentifikatsiya va Avtorizatsiya

**Texnik tafsilotlar:**
- **JWT (JSON Web Token)** asosida autentifikatsiya mexanizmi
- **Bcrypt** algoritmi orqali parollarni shifrlash (10 salt rounds)
- Tokenning amal qilish muddati: 7 kun (sozlanishi mumkin)

**Funksionallik:**
- Foydalanuvchi ro'yxatdan o'tish (Register)
- Tizimga kirish va chiqish (Login/Logout)
- Rol asosida ruxsat tizimi (Role-Based Access Control - RBAC)

**Foydalanuvchi rollari:**
1. **User (Oddiy foydalanuvchi)**
   - O'z matnlarini tahlil qilish
   - Shaxsiy tahlil tarixini ko'rish
   - O'z natijalarini boshqarish

2. **Moderator**
   - Barcha User imkoniyatlari
   - Toksik kontentni ko'rib chiqish
   - Xabarlarni tasdiqlash yoki rad etish
   - Moderatsiya statistikasini ko'rish
   - Eslatmalar (review notes) qo'shish

3. **Admin (Administrator)**
   - Barcha Moderator imkoniyatlari
   - Foydalanuvchilarni boshqarish (bloklash, o'chirish)
   - Foydalanuvchi rollarini o'zgartirish
   - Tizim sozlamalarini boshqarish
   - Dashboard va to'liq statistika
   - Haftalik tahlil va grafiklar

### 2. Sun'iy Intellekt asosida Matn Tahlili

**AI texnologiyasi:**
- **Model:** OpenAI GPT-4o-mini (cost-effective va tez)
- **Tahlil tili:** O'zbek tili
- **Javob formati:** JSON structure
- **Temperature:** 0.3 (aniq va izchil natijalar uchun)

**Tahlil mezonlari:**

1. **Toksiklik balli (Toxicity Score): 0-100**
   - Matnning umumiy toksiklik darajasini baholaydi
   - AI model kontekstni hisobga oladi

2. **Tajovuz balli (Aggression Score): 0-100**
   - Zo'ravonlik, qo'pollik va tajovuzkorlik darajasini aniqlaydi
   - Fizik yoki verbal agressivlikni baholaydi

3. **Haqorat balli (Offense Score): 0-100**
   - Tahqirlovchi, kamsituvchi va haqoratli iboralarni aniqlaydi
   - Shaxsga qaratilgan haqorat darajasini o'lchaydi

4. **Tahdid balli (Threat Score): 0-100**
   - Qo'rqituvchi, tahdid qiluvchi va xavf tug'diruvchi iboralarni baholaydi
   - Xavfsizlikka potensial xavfni aniqlaydi

**Toksiklik darajalari:**
- **Xavfsiz (Safe):** 0-29 ball - matn toksik elementlarsiz
- **Shubhali (Suspicious):** 30-69 ball - moderator ko'rib chiqishi kerak
- **Toksik (Toxic):** 70-100 ball - xavfli kontent, darhol bloklanadi

**Toksik so'zlarni aniqlash:**
- Har bir toksik so'z alohida aniqlanadi
- So'zning matndagi pozitsiyasi ko'rsatiladi
- Jiddiylik darajasi belgilanadi: **Low (Past)**, **Medium (O'rta)**, **High (Yuqori)**

### 3. Moderatsiya Tizimi

**Moderatsiya jarayoni:**

1. **Avtomatik filtrlash:**
   - Toksiklik balli 70 dan yuqori matnlar avtomatik "kutish ro'yxati"ga tushadi
   - Moderator uchun prioritet bo'yicha tartiblangan

2. **Moderatsiya harakatlari:**
   - **Tasdiqlash (Approve):** Matn xavfsiz deb tasdiqlanadi (false positive holatlarda)
   - **Rad etish (Reject):** Matn toksik deb tasdiqlangan va bloklanadi
   - **Eslatma qo'shish:** Moderator o'z qarorini asoslaydi

3. **Statuslar:**
   - **Pending:** Moderatsiya kutilmoqda
   - **Approved:** Tasdiqlanganlar
   - **Rejected:** Rad etilganlar

4. **Statistika:**
   - Jami moderatsiya qilingan elementlar soni
   - Tasdiqlangan va rad etilganlar foiz nisbati
   - Moderator faoliyati hisoboti

### 4. Admin Panel va Dashboard

**Dashboard ko'rsatkichlari:**
- **Jami foydalanuvchilar soni** - tizimda ro'yxatdan o'tganlar
- **Jami tahlillar soni** - amalga oshirilgan tekshiruvlar
- **Toksik kontentlar soni** - aniqlangan xavfli matnlar
- **Shubhali kontentlar soni** - moderatsiya kutayotgan matnlar
- **Xavfsiz kontentlar soni** - muammosiz matnlar
- **Faol foydalanuvchilar** - oxirgi 24 soatda faol bo'lganlar
- **Bugungi yangi foydalanuvchilar** - kunlik o'sish statistikasi

**Haftalik statistika grafiklari:**
- Kunlik tahlillar soni dinamikasi
- Toksiklik tendentsiyalari (7, 14, 30 kunlik davr)
- Foydalanuvchilar faolligi
- Moderatsiya samaradorligi

**Foydalanuvchilarni boshqarish:**
- Barcha foydalanuvchilar ro'yxati (sahifalash bilan)
- Qidiruv funksiyasi (ism, email bo'yicha)
- Filtrlash (rol, bloklanganlik statusi bo'yicha)
- Rolni o'zgartirish (User → Moderator → Admin)
- Foydalanuvchini bloklash/blokdan chiqarish
- Foydalanuvchini o'chirish

**Tizim sozlamalari:**
- Maksimal matn uzunligi
- Toksiklik chegarasi (threshold)
- Moderatsiya avtomatizatsiya darajasi

**So'nggi xavfli matnlar:**
- Real-time ravishda yangilangan ro'yxat
- Eng yuqori toksiklik balliga ega matnlar
- Tezkor moderatsiya imkoniyati

### 5. Natijalar va Tarix (Results & History)

**Foydalanuvchi natijalar:**
- Shaxsiy tahlil tarixi (sahifalash bilan)
- Har bir tahlilning batafsil ma'lumotlari
- Vaqt bo'yicha saralash
- Tahlillarni o'chirish

**Admin natijalar:**
- Barcha foydalanuvchilar natijalarini ko'rish
- Foydalanuvchi bo'yicha filtrlash
- Toksiklik darajasi bo'yicha filtrlash
- Export qilish (CSV, JSON formatlarida)

### 6. Xavfsizlik va Himoya

**Ma'lumotlar xavfsizligi:**
- **HTTPS protokoli** - shifrlangan aloqa
- **CORS (Cross-Origin Resource Sharing)** sozlamalari
- **Input validatsiya** - barcha kiritilayotgan ma'lumotlar tekshiriladi
- **MongoDB Injection himoyasi** - Mongoose ODM orqali xavfsiz querylar
- **XSS (Cross-Site Scripting) himoyasi** - sanitization qo'llaniladi

**Parol xavfsizligi:**
- Minimum 6 ta belgi talab qilinadi
- Bcrypt hashing (10 salt rounds)
- Parollar hech qachon plain text sifatida saqlanmaydi
- Parolni unutish/tiklash mexanizmi (rejada)

**API xavfsizligi:**
- JWT token autentifikatsiya
- Token muddati tugashi mexanizmi
- Protected endpoints (faqat autentifikatsiyalangan foydalanuvchilar uchun)
- Role-based access control (RBAC)

### 7. RESTful API

**Asosiy endpointlar:**

**Authentication (`/api/auth`):**
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Tizimga kirish

**Analysis (`/api/analysis`):**
- `POST /api/analysis/check` - Matnni tahlil qilish
- `GET /api/analysis/history` - Tahlil tarixi
- `GET /api/analysis/:id` - Tahlilni ID bo'yicha olish
- `DELETE /api/analysis/:id` - Tahlilni o'chirish

**Results (`/api/results`):**
- `GET /api/results/list` - O'z natijalarim
- `GET /api/results/all` - Barcha natijalar (Admin)
- `GET /api/results/user/:userId` - Foydalanuvchi natijalari

**Moderation (`/api/moderation`):**
- `GET /api/moderation/list` - Moderatsiya ro'yxati
- `GET /api/moderation/stats` - Moderatsiya statistikasi
- `POST /api/moderation/action` - Moderatsiya harakati
- `DELETE /api/moderation/:id` - Elementni o'chirish

**Admin (`/api/admin`):**
- `GET /api/admin/dashboard` - Dashboard ma'lumotlari
- `GET /api/admin/users` - Foydalanuvchilar ro'yxati
- `PATCH /api/admin/users/:id/role` - Rolni o'zgartirish
- `PATCH /api/admin/users/:id/block` - Bloklash/blokdan chiqarish
- `DELETE /api/admin/users/:id` - Foydalanuvchini o'chirish
- `GET /api/admin/weekly-statistics` - Haftalik statistika
- `GET /api/admin/recent-dangerous` - So'nggi xavfli matnlar

**Swagger/OpenAPI dokumentatsiya:**
- Interaktiv API dokumentatsiya: `http://localhost:5001/api-docs`
- Barcha endpointlarni brauzerda sinash imkoniyati
- Request/Response formatlarining to'liq tavsifi

### 8. Frontend Interface

**Texnologiyalar:**
- **React 18** - zamonaviy UI library
- **TypeScript** - type-safe development
- **React Router v6** - routing va navigatsiya
- **Tailwind CSS** - utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - data visualization

**Sahifalar:**
1. **Login/Register** - autentifikatsiya
2. **Home** - bosh sahifa va umumiy ma'lumot
3. **Check** - matn tahlili interfeysi
4. **Results** - natijalar va tarix
5. **Moderation** - moderatorlar uchun panel
6. **Admin Dashboard** - administratorlar uchun boshqaruv paneli
7. **About** - tizim haqida ma'lumot

**Responsive dizayn:**
- Desktop (>1024px)
- Tablet (768px - 1024px)
- Mobile (<768px)

**Dark mode qo'llab-quvvatlash:**
- Tungi rejim (dark theme)
- Kunduzgi rejim (light theme)
- Avtomatik tizim sozlamalariga moslashish

---

## Texnik arxitektura

### Backend Stack
- **Framework:** NestJS 10.x (Node.js)
- **Language:** TypeScript 5.x
- **Database:** MongoDB 6.x + Mongoose ODM 8.x
- **AI/ML:** OpenAI GPT-4o-mini API
- **Authentication:** Passport.js + JWT
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger/OpenAPI

### Frontend Stack
- **Framework:** React 18.x
- **Language:** TypeScript 5.x
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Build Tool:** Vite 5.x
- **Charts:** Recharts

### DevOps
- **Package Manager:** npm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Testing:** Jest (backend), React Testing Library (frontend)
- **Version Control:** Git
- **Deployment:** PM2, Docker (optional), Nginx (optional)

---

## Xulosalar

Sentinella tizimi zamonaviy sun'iy intellekt texnologiyalari va web-dasturlash best practice'lari asosida yaratilgan to'liq funksional toksik kontent moderatsiya platformasidir. Tizim o'zbek tilidagi matnlarni samarali tahlil qilish, moderatsiya jarayonini avtomatlashtirish va xavfsiz onlayn muhit yaratishga qaratilgan.

Loyihaning asosiy afzalliklari:
- **AI-powered tahlil** - OpenAI texnologiyasi orqali yuqori aniqlik
- **Scalable arxitektura** - NestJS va MongoDB orqali kengaytiriladigan tizim
- **User-friendly interface** - zamonaviy React interfeysi
- **Comprehensive security** - ko'p qatlamli xavfsizlik tizimi
- **Role-based access** - samarali foydalanuvchilar boshqaruvi
- **Real-time processing** - darhol natija berish

Tizim kelajakda email verifikatsiya, refresh token mexanizmi, real-time notifications (WebSocket), Redis caching va boshqa zamonaviy funksiyalar bilan kengaytirilishi rejalashtirilgan.
