# SENTINELLA LOYIHASIDA FOYDALANUVCHI INTERFEYSI (USER INTERFACE)

## 1. UMUMIY DIZAYN TIZIMI

Sentinella loyihasi zamonaviy Material Design 3 (Material You) prinsiplariga asoslangan interfeys dizayniga ega. Dizayn tizimi Tailwind CSS framework yordamida amalga oshirilgan.

### 1.1. Rang tizimi (Color System)

Loyihada quyidagi asosiy ranglar ishlatilgan:

- **Primary** (Indigo): `#5525CD` - Asosiy aksiya tugmalari, logotip, faol holatlar
- **Surface Container**: Oq va och kulrang variantlar - Kartalar va fon
- **Error** (Qizil): Toksik va xavfli kontentni ko'rsatish
- **Secondary** (Yashil): Xavfsiz kontentni ko'rsatish
- **Tertiary** (Sariq): Shubhali kontentni ko'rsatish

### 1.2. Tipografiya (Typography)

Ikki asosiy font oilasi:
- **Headline Font**: `headline-font` class - Sarlavhalar va muhim matnlar uchun
- **Body Font**: `font-body` class - Oddiy matnlar uchun
- **Label Font**: `font-label` class - Yorliqlar va kichik matnlar uchun

Material Symbols ikonkalar kutubxonasidan foydalanilgan (`material-symbols-outlined`).

## 2. NAVIGATSIYA TIZIMI

### 2.1. Desktop navigatsiya (TopAppBar)

`sentinel-app/src/components/TopAppBar.tsx:37-114`

**Joylashuvi**: Ekranning yuqori qismida fixed position

**Komponentlar**:
- **Logotip**: "Sentinel" yozuvi bilan birga `security` ikonkasi
- **Navigatsiya menyulari**:
  - Bosh sahifa (`/home`)
  - Tekshirish (`/check`)
  - Natijalar (`/results`)
  - Loyiha haqida (`/about`)
  - Moderatsiya (`/moderation`) - faqat moderator va admin uchun
  - Admin (`/admin`) - faqat admin uchun
  - Kirish/Chiqish tugmasi

**Faol holat ko'rsatkichi**: Joriy sahifa bo'ld shrift va indigo rangda ko'rsatiladi.

```typescript
className={`px-3 py-1 rounded-lg transition-colors ${
  isActive('/check')
    ? 'text-indigo-700 dark:text-indigo-300 font-bold'
    : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50'
}`}
```

### 2.2. Mobile navigatsiya (BottomNavBar)

`sentinel-app/src/components/BottomNavBar.tsx:37-151`

**Joylashuvi**: Ekranning pastki qismida, yumaloq burchakli kartada

**Xususiyatlari**:
- 4 ta asosiy tugma (ikona + matn)
- Faol holat: katta masshtab (`scale-110`), indigo fon, oq matn
- Nofaol holat: kulrang, shaffof
- Active scale animatsiyasi (`active:scale-90`)
- Role-based conditional rendering

**Misol kod**:
```typescript
<Link
  to="/check"
  className={`flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90 ${
    isActive('/check')
      ? 'bg-indigo-600 text-white rounded-2xl scale-110 shadow-lg'
      : 'text-slate-400 opacity-70 hover:text-indigo-500'
  }`}
>
  <span className="material-symbols-outlined">search_check</span>
  <span className="text-[11px] font-semibold uppercase mt-1">Tekshirish</span>
</Link>
```

## 3. BOSH SAHIFA (HOME PAGE)

`sentinel-app/src/pages/Home/Home.tsx`

### 3.1. Hero Section

**Joylashuvi**: `Home.tsx:9-64`

**Tarkibi**:
- **Sarlavha**: Katta, bo'ld shrift bilan "Matnli ma'lumotlarda toksik kontentni aniqlash tizimi"
  - `text-4xl md:text-6xl` - responsiv o'lcham
  - `<span className="text-primary">` - kalit so'zlarni ajratib ko'rsatish

- **Tavsif**: 1-2 gapli qisqa tushuntirish

- **CTA tugmalari**:
  - **Tekshirishni boshlash**: Primary tugma, `/check` sahifasiga yo'naltiradi
  - **Loyiha haqida**: Ikkilamchi tugma, `/about` sahifasiga yo'naltiradi

- **Rasm**: 3D vizualizatsiya
  - Hover effekt: `grayscale-[0.2]` dan `grayscale-0` ga o'tish
  - Gradient overlay: `bg-gradient-to-tr from-primary/20`

- **Floating Card**: Toksiklik aniqlandi namunasi
  - Faqat desktop da ko'rinadi (`hidden lg:block`)
  - Error ikona bilan 99.4% aniqlik ko'rsatkichi

### 3.2. Features Section

**Joylashuvi**: `Home.tsx:67-109`

**3 ta feature karta**:

1. **Tezkor tahlil** - `bolt` ikonkasi
2. **Yuqori aniqlik** - `verified_user` ikonkasi
3. **Oson foydalanish** - `touch_app` ikonkasi

Har bir karta:
- Hover effekti: `hover:shadow-xl`, `hover:border-outline-variant/20`
- Ikona animatsiyasi: `group-hover:scale-110`

### 3.3. Stats Section

**Joylashuvi**: `Home.tsx:112-137`

**4 ta statistika kartasi** (2x2 yoki 1x4 grid):
- **1M+** - Tekshirilgan matnlar
- **98.5%** - Aniqlik darajasi
- **24/7** - Monitoring
- **100+** - Hamkorlar

**Dizayn**:
- Primary gradient fon
- Dekorativ elementlar: blur effektli doiralar
- Katta raqamlar (`text-4xl md:text-5xl`) + kichik matnlar

## 4. TEKSHIRISH SAHIFASI (CHECK PAGE)

`sentinel-app/src/pages/Check/Check.tsx`

### 4.1. Matn kiritish bo'limi

**Joylashuvi**: `Check.tsx:121-180`

**Textarea komponenti**:
```typescript
<textarea
  className="w-full h-64 bg-surface-container-low border-none rounded-xl p-6
             font-body text-on-surface placeholder:text-outline
             focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright
             transition-all resize-none text-lg leading-relaxed"
  placeholder="Tahlil qilish uchun matnni kiriting..."
  value={text}
  onChange={(e) => setText(e.target.value)}
  disabled={loading}
/>
```

**Xususiyatlari**:
- 64 qator balandlikda (`h-64`)
- Real-time belgi hisoblagichi: `{text.length} / 5000 belgilar`
- Focus holat: ring effekt (`focus:ring-2 focus:ring-primary/20`)
- Disabled holat: yuklash jarayonida

**Qo'shimcha ma'lumotlar**:
- Til ko'rsatkichi: O'zbek tili
- AI model: Sentinel-v2
- Material ikonkalar: `language`, `auto_awesome`

**Tahlil qilish tugmasi**:
```typescript
<button
  onClick={handleAnalyze}
  disabled={loading || !text.trim()}
  className="bg-primary hover:bg-primary-container text-white px-10 py-4
             rounded-xl font-headline font-bold tracking-wide transition-all
             active:scale-95 flex items-center gap-3 shadow-lg shadow-indigo-200
             disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
  <span className="material-symbols-outlined" data-icon="bolt">bolt</span>
</button>
```

### 4.2. Natijalarni ko'rsatish (3 metrika)

**Joylashuvi**: `Check.tsx:183-257`

Tahlil tugagandan so'ng, 3 ta metrika kartasi ko'rsatiladi:

#### 4.2.1. Agressivlik (Aggression)

**Rang**: Primary (Indigo)
**Ikona**: `thunderstorm`

```typescript
<div className="bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-sm">
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-primary">thunderstorm</span>
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
```

**Vizualizatsiya**:
- Katta foiz raqami (3xl font)
- Progress bar (1.5 piksel balandlikda)
- Border-left aksenti (4px)

#### 4.2.2. Haqorat (Offense)

**Rang**: Error (Qizil)
**Ikona**: `gavel`

Xuddi yuqoridagi strukturada, faqat ranglar error rangiga o'zgartirilgan:
- `border-error`
- `text-error`
- `bg-error`

#### 4.2.3. Tahdid (Threat)

**Rang**: Secondary (Ko'k/Yashil)
**Ikona**: `crisis_alert`

Xuddi yuqoridagi strukturada, faqat ranglar secondary rangiga o'zgartirilgan:
- `border-secondary`
- `text-secondary`
- `bg-secondary`

### 4.3. Tarix bo'limi (Sidebar)

**Joylashuvi**: `Check.tsx:261-334`

**O'ng tomonda (desktop)** yoki **pastda (mobile)** joylashgan sidebar.

**Sarlavha**: "Oldingi tekshiruvlar" + `history` ikonkasi

**Har bir tarix elementi** (`Check.tsx:283-324`):

```typescript
<div className="bg-surface-container-lowest p-5 rounded-lg border
                border-transparent hover:border-primary/10 transition-all
                cursor-pointer group">
  {/* Badge */}
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
    level === 'Toksik'
      ? 'bg-error-container text-on-error-container'
      : level === 'Xavfsiz'
      ? 'bg-surface-container text-secondary'
      : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
  }`}>
    {level}
  </span>

  {/* Vaqt */}
  <span className="text-[10px] text-outline font-label">
    {formatTime(item.analyzedAt)}
  </span>

  {/* Matn (2 qator) */}
  <p className="text-sm font-body text-on-surface line-clamp-2 mb-3 leading-relaxed">
    {item.text}
  </p>

  {/* Progress bar + foiz */}
  <div className="flex items-center gap-2">
    <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
      <div className="h-full bg-secondary" style={{ width: `${item.toxicityScore}%` }}></div>
    </div>
    <span className="text-[10px] font-bold text-secondary">{item.toxicityScore}%</span>
  </div>
</div>
```

**Xususiyatlari**:
- 3 ta eng so'nggi natija (`pageSize: 3`)
- Hover effekt: border rangini o'zgartiradi
- `line-clamp-2`: maksimal 2 qator matn ko'rsatish
- "Barchasini ko'rish" tugmasi: `/results` sahifasiga yo'naltiradi

## 5. NATIJALAR SAHIFASI (RESULTS PAGE)

`sentinel-app/src/pages/Results/Results.tsx`

### 5.1. Admin rejimi banneri

**Joylashuvi**: `Results.tsx:73-83`

Admin foydalanuvchilar uchun maxsus banner:

```typescript
{isAdmin && (
  <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded-xl
                  flex items-center gap-3">
    <span className="material-symbols-outlined text-primary text-2xl">
      admin_panel_settings
    </span>
    <div>
      <h3 className="font-bold text-primary">Admin rejimi</h3>
      <p className="text-sm text-on-surface-variant">
        Siz barcha foydalanuvchilarning natijalarini ko'rishingiz mumkin
      </p>
    </div>
  </div>
)}
```

### 5.2. Layout strukturasi

**Grid tizimi**: 12 ustunli grid (`lg:grid-cols-12`)
- **Sidebar**: 4 ustun (`lg:col-span-4`)
- **Main content**: 8 ustun (`lg:col-span-8`)

### 5.3. Sidebar: Tahlil summarysi

**Joylashuvi**: `Results.tsx:111-199`

#### 5.3.1. Status Badge

Toksiklik darajasiga qarab rang berish:

```typescript
<div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full
                 bg-${getToxicityColor(selectedResult.toxicityScore)}-container
                 text-on-${getToxicityColor(selectedResult.toxicityScore)}-container
                 font-semibold text-sm`}>
  <span className="material-symbols-outlined text-sm"
        style={{ fontVariationSettings: "'FILL' 1" }}>
    {selectedResult.toxicityScore >= 70 ? 'warning' : 'info'}
  </span>
  <span>{getToxicityLevel(selectedResult.toxicityScore)}</span>
</div>
```

**getToxicityLevel funksiyasi** (`Results.tsx:53-57`):
```typescript
const getToxicityLevel = (score: number) => {
  if (score >= 70) return 'Toksik';
  if (score >= 40) return 'Shubhali';
  return 'Xavfsiz';
};
```

**getToxicityColor funksiyasi** (`Results.tsx:59-63`):
```typescript
const getToxicityColor = (score: number) => {
  if (score >= 70) return 'error';    // Qizil
  if (score >= 40) return 'tertiary'; // Sariq
  return 'secondary';                  // Yashil
};
```

#### 5.3.2. Toksiklik darajasi gauge

**Joylashuvi**: `Results.tsx:145-163`

```typescript
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
```

**Xususiyatlari**:
- Katta foiz raqami (3xl)
- Gradient progress bar
- Yumaloq burchakli

#### 5.3.3. Tafsilotlar bo'limi

**Joylashuvi**: `Results.tsx:166-197`

3 ta qator:
- **Sana**: `toLocaleDateString('uz-UZ')`
- **Vaqt**: `toLocaleTimeString('uz-UZ')`
- **ID**: Qisqartirilgan (faqat birinchi 8 belgi) + mono font

```typescript
<div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
  <h3 className="font-label font-bold text-xs uppercase tracking-widest text-outline mb-4">
    Tafsilotlar
  </h3>
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-on-surface-variant">Sana:</span>
      <span className="text-sm font-semibold">
        {new Date(selectedResult.analyzedAt).toLocaleDateString('uz-UZ', {
          day: '2-digit', month: 'short', year: 'numeric'
        })}
      </span>
    </div>
    {/* ... */}
  </div>
</div>
```

### 5.4. Main Content: Tahlil qilingan matn

**Joylashuvi**: `Results.tsx:206-225`

```typescript
<section className="bg-surface-container-lowest rounded-xl overflow-hidden
                    shadow-sm border border-outline-variant/10">
  <div className="bg-surface-container px-8 py-4 flex items-center justify-between">
    <span className="font-label text-xs font-bold uppercase tracking-widest
                     text-on-surface-variant">
      Tahlil qilingan matn
    </span>
    <button
      className="material-symbols-outlined text-outline hover:text-primary transition-colors"
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
```

**Xususiyatlari**:
- Nusxa olish tugmasi (`content_copy`)
- Italic shriftda kotirovka
- Ikki qismli karta: header + body

### 5.5. Batafsil scorlar (3 metrika)

**Joylashuvi**: `Results.tsx:228-300`

Check sahifasidagi kabi 3 ta karta:
1. Agressivlik (Primary rang)
2. Haqorat (Error rang)
3. Tahdid (Secondary rang)

Har biri:
- Ikona + nom
- Katta foiz raqami
- Progress bar
- Border-left aksenti

### 5.6. Natijalar ro'yxati

**Joylashuvi**: `Results.tsx:324-393`

**Sarlavha qatori**:
- "Mening natijalarim" yoki "Barcha natijalar (Admin)"
- Jami natijalar soni: `Jami: {total} ta natija`
- Admin badge (agar admin bo'lsa)

**Har bir natija kartasi**:

```typescript
<div
  key={result.id}
  onClick={() => setSelectedResult(result)}
  className={`bg-surface-container-lowest p-6 rounded-xl border cursor-pointer
              transition-all hover:shadow-lg ${
    selectedResult?.id === result.id
      ? 'border-primary shadow-md'
      : 'border-outline-variant/10'
  }`}
>
  {/* Badge: Toksik/Shubhali/Xavfsiz */}
  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
    result.toxicityScore >= 70
      ? 'bg-error-container text-on-error-container'
      : result.toxicityScore >= 40
      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
      : 'bg-surface-container text-secondary'
  }`}>
    {getToxicityLevel(result.toxicityScore)}
  </span>

  {/* Sana */}
  <span className="text-[10px] text-outline font-label">
    {new Date(result.analyzedAt).toLocaleDateString('uz-UZ')}
  </span>

  {/* Matn (maksimal 2 qator) */}
  <p className="text-sm font-body text-on-surface line-clamp-2 mb-3 leading-relaxed">
    {result.text}
  </p>

  {/* Progress bar + foiz */}
  <div className="flex items-center gap-2">
    <div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
      <div className="h-full bg-error" style={{ width: `${result.toxicityScore}%` }}></div>
    </div>
    <span className="text-[10px] font-bold text-error">{result.toxicityScore}%</span>
  </div>
</div>
```

**Interaktivlik**:
- Click qilganda `setSelectedResult(result)` chaqiriladi
- Tanlangan element `border-primary` bilan ajratib ko'rsatiladi
- Hover effekt: `hover:shadow-lg`

### 5.7. Pagination (Sahifalash)

**Joylashuvi**: `Results.tsx:396-427`

```typescript
<div className="mt-8 flex items-center justify-between">
  {/* Oldingi tugma */}
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="px-6 py-3 bg-surface-container-highest text-on-surface font-bold
               rounded-xl flex items-center gap-2 hover:bg-surface-dim
               active:scale-95 transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="material-symbols-outlined">chevron_left</span>
    Oldingi
  </button>

  {/* Sahifa ko'rsatkichi */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-on-surface-variant">
      Sahifa <span className="font-bold text-primary">{page}</span> /{' '}
      <span className="font-bold">{Math.ceil(total / pageSize)}</span>
    </span>
  </div>

  {/* Keyingi tugma */}
  <button
    onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / pageSize)))}
    disabled={page >= Math.ceil(total / pageSize)}
    className="px-6 py-3 bg-surface-container-highest text-on-surface font-bold
               rounded-xl flex items-center gap-2 hover:bg-surface-dim
               active:scale-95 transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Keyingi
    <span className="material-symbols-outlined">chevron_right</span>
  </button>
</div>
```

**Xususiyatlari**:
- Har sahifada 3 ta natija (`pageSize: 3`)
- Disabled holat: 1-sahifada "Oldingi", oxirgi sahifada "Keyingi"
- Active scale animatsiyasi: `active:scale-95`
- Joriy sahifa ko'rsatkichi: `Sahifa 2 / 10`

## 6. GRAFIKLAR VA INDIKATORLAR

### 6.1. Progress Bar (Linear Indicator)

Loyihada 2 xil o'lchamdagi progress bar mavjud:

#### 6.1.1. Kichik progress bar (1px)

Tarix elementlarida ishlatiladi:

```typescript
<div className="h-1 flex-1 bg-surface-container-high rounded-full overflow-hidden">
  <div
    className="h-full bg-secondary"
    style={{ width: `${item.toxicityScore}%` }}
  ></div>
</div>
```

#### 6.1.2. O'rtacha progress bar (1.5px)

Check sahifasidagi metrika kartalarida:

```typescript
<div className="h-1.5 w-full bg-surface-container rounded-full">
  <div
    className="h-full bg-primary rounded-full"
    style={{ width: `${result.aggressionScore ?? 0}%` }}
  ></div>
</div>
```

#### 6.1.3. Katta progress bar (3px / 12px)

Results sahifasidagi gauge:

```typescript
<div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
    style={{ width: `${selectedResult.toxicityScore}%` }}
  ></div>
</div>
```

### 6.2. Badge indikatorlari

**3 xil holat badge**:

1. **Xavfsiz** (0-39):
   - `bg-surface-container text-secondary`
   - Yashil rang

2. **Shubhali** (40-69):
   - `bg-tertiary-fixed text-on-tertiary-fixed-variant`
   - Sariq rang

3. **Toksik** (70-100):
   - `bg-error-container text-on-error-container`
   - Qizil rang

**Kod namunasi**:
```typescript
<span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
  level === 'Toksik'
    ? 'bg-error-container text-on-error-container'
    : level === 'Xavfsiz'
    ? 'bg-surface-container text-secondary'
    : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
}`}>
  {level}
</span>
```

### 6.3. Metrika kartalar (Score Cards)

3 ta asosiy metrika har birining o'ziga xos dizayni:

**Strukturasi**:
1. **Sarlavha qatori**: Ikona + Nom
2. **Katta raqam**: Score (0-100%)
3. **Progress bar**: Vizual ko'rsatkich

**Border accent**: Har bir karta chap tomonida 4px rangli border

```typescript
border-l-4 border-primary  // Agressivlik
border-l-4 border-error    // Haqorat
border-l-4 border-secondary // Tahdid
```

### 6.4. Statistika kartalar

Home sahifasida 4 ta statistika kartasi:

```typescript
<div className="space-y-2">
  <p className="text-4xl md:text-5xl font-extrabold headline-font">1M+</p>
  <p className="text-sm uppercase tracking-widest opacity-80">Tekshirilgan matnlar</p>
</div>
```

**Dizayn xususiyatlari**:
- Juda katta raqamlar (`text-4xl` - `text-5xl`)
- Kichik uppercase matn
- Primary gradient fon
- Dekorativ blur effektlar

## 7. RESPONSIVE DIZAYN

### 7.1. Breakpoint tizimi

Tailwind CSS standart breakpointlari:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### 7.2. Grid tizimi

**Desktop** (lg va yuqori):
- 12 ustunli grid
- Sidebar (4 ustun) + Main content (8 ustun)

**Tablet** (md):
- 2-3 ustunli grid
- Metrika kartalar: 3 ustun

**Mobile** (< md):
- 1 ustunli layout
- Stack qilingan komponentlar
- BottomNavBar ko'rinadi

### 7.3. Tipografiya scaling

```typescript
className="text-4xl md:text-5xl lg:text-6xl"
```

Kichik ekranlarda kichikroq, katta ekranlarda kattaroq.

### 7.4. Navigation o'zgarishi

- **Desktop**: TopAppBar (horizontal)
- **Mobile**: BottomNavBar (vertical, rounded card)

## 8. INTERAKTIV ELEMENTLAR

### 8.1. Tugma holatlari

**Normal holat**:
```typescript
className="bg-primary text-white px-8 py-4 rounded-xl"
```

**Hover holat**:
```typescript
hover:bg-primary-container
```

**Active/Click holat**:
```typescript
active:scale-95 transition-all
```

**Disabled holat**:
```typescript
disabled:opacity-50 disabled:cursor-not-allowed
```

### 8.2. Karta hover effektlari

```typescript
className="transition-all hover:shadow-lg hover:border-primary/10"
```

Feature kartalar:
```typescript
className="group border border-transparent hover:border-outline-variant/20 hover:shadow-xl"
```

Ikona animatsiyasi:
```typescript
className="group-hover:scale-110 transition-transform"
```

### 8.3. Focus holatlari

Input va textarea uchun:
```typescript
className="focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition-all"
```

### 8.4. Loading holati

Tahlil jarayonida:
```typescript
{loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
```

Textarea disabled:
```typescript
disabled={loading}
```

## 9. ANIMATION VA TRANSITION

### 9.1. Tugma animatsiyalari

```typescript
className="transition-all active:scale-95 duration-200"
```

### 9.2. Hover transition

```typescript
className="transition-colors"  // Ranglar uchun
className="transition-all"     // Barcha propertylar uchun
className="transition-transform duration-700" // Transform uchun
```

### 9.3. Image hover effekt

```typescript
className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
```

### 9.4. Scale animatsiyalari

Mobile navigation:
```typescript
className="scale-110 shadow-lg"  // Faol holat
className="active:scale-90"       // Click holat
```

## 10. IKONKALAR

### 10.1. Material Symbols

Barcha ikonkalar Google Material Symbols kutubxonasidan:

```typescript
<span className="material-symbols-outlined" data-icon="security">
  security
</span>
```

### 10.2. Filled variant

Ba'zi ikonkalar "filled" stilida:

```typescript
<span
  className="material-symbols-outlined"
  style={{ fontVariationSettings: "'FILL' 1" }}
>
  warning
</span>
```

### 10.3. Asosiy ishlatilgan ikonkalar

- `security` - Logotip
- `bolt` - Tezkorlik, tahlil
- `thunderstorm` - Agressivlik
- `gavel` - Haqorat
- `crisis_alert` - Tahdid
- `warning` - Ogohlantirish
- `info` - Ma'lumot
- `home` - Bosh sahifa
- `search_check` - Tekshirish
- `list_alt` - Natijalar
- `content_copy` - Nusxa olish
- `chevron_left` / `chevron_right` - Pagination
- `admin_panel_settings` - Admin
- `check_circle` - Moderatsiya

## 11. XULOSA

Sentinella loyihasining foydalanuvchi interfeysi zamonaviy dizayn prinsiplariga asoslangan:

### 11.1. Asosiy xususiyatlar

1. **Material Design 3**: Zamonaviy, minimal dizayn
2. **Responsive**: Desktop, tablet, mobile uchun moslashgan
3. **Accessibility**: Katta shriftlar, yuqori kontrastli ranglar
4. **Interaktivlik**: Hover, click, focus effektlari
5. **Vizualizatsiya**: Progress barlar, badge indikatorlar, metrika kartalar
6. **Navigation**: Role-based, adaptive (TopAppBar/BottomNavBar)

### 11.2. Natijalar ko'rsatish

**Toksiklik darajasi 3 kategoriyaga bo'linadi**:
- **Xavfsiz (0-39)**: Yashil rang, `secondary`
- **Shubhali (40-69)**: Sariq rang, `tertiary`
- **Toksik (70-100)**: Qizil rang, `error`

**Ko'rsatish usullari**:
- **Badge**: Kichik, rangli yorliq (Toksik/Shubhali/Xavfsiz)
- **Progress bar**: Linear indikator (0-100%)
- **Foiz raqami**: Katta, bo'ld shrift
- **Metrika kartalar**: 3 ta alohida karta (Agressivlik, Haqorat, Tahdid)

### 11.3. Grafik elementlar

1. **Linear progress bars** (1px, 1.5px, 3px)
2. **Badge indikatorlar** (Xavfsiz/Shubhali/Toksik)
3. **Metrika kartalar** (border-left aksent)
4. **Statistika kartalar** (katta raqamlar)
5. **Gradient fon** (dekorativ elementlar)

### 11.4. UI ishlash mexanizmi

1. **Matn kiriting** → Textarea (5000 belgi limit)
2. **Tahlil qilish** → Loading holat
3. **Natijalar** → 3 metrika kartasi ko'rsatiladi
4. **Tarix** → Oxirgi 3 ta natija sidebar da
5. **Batafsil** → Results sahifasida to'liq ma'lumot

---

**Muallif**: Sentinella Development Team
**Sana**: 2026-04-16
**Versiya**: 1.0
