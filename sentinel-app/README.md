# Sentinel - Toksik Mazmunni Aniqlash Tizimi

Sentinel - O'zbek tilidagi toksik mazmunni aniqlash va moderatsiya qilish uchun mo'ljallangan zamonaviy web ilova.

## Texnologiyalar

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Language**: TypeScript 5.3
- **Routing**: React Router DOM 6.21
- **HTTP Client**: Axios 1.6
- **Styling**: CSS3 with Custom Properties

## Loyiha Strukturasi

```
Sentinel-app/
├── src/
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.tsx
│   │   │   └── _api.ts
│   │   ├── Register/
│   │   │   ├── Register.tsx
│   │   │   └── _api.ts
│   │   ├── Home/
│   │   │   └── Home.tsx
│   │   ├── Check/
│   │   │   ├── Check.tsx
│   │   │   └── _api.ts
│   │   ├── Moderation/
│   │   │   ├── Moderation.tsx
│   │   │   └── _api.ts
│   │   ├── Results/
│   │   │   ├── Results.tsx
│   │   │   └── _api.ts
│   │   └── Admin/
│   │       ├── Admin.tsx
│   │       └── _api.ts
│   ├── types/
│   │   └── api.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── axios.ts         # Axios configuration
│   ├── App.tsx              # Main App component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## O'rnatish

1. Loyihani klonlash yoki yuklab olish
2. Dependencies o'rnatish:

```bash
cd Sentinel-app
npm install
```

3. Environment variables sozlash:

```bash
cp .env.example .env
```

`.env` faylida API URL ni sozlang:

```
VITE_API_BASE_URL=http://localhost:5001/api
```

## Ishga tushirish

### Development rejimida:

```bash
npm run dev
```

Ilova `http://localhost:3000` da ochiladi.

### Production build:

```bash
npm run build
```

Build fayllari `dist/` papkasida hosil bo'ladi.

### Preview production build:

```bash
npm run preview
```

## Sahifalar

### 1. Login (`/login`)
- Foydalanuvchilarni tizimga kiritish
- Token bilan autentifikatsiya

### 2. Register (`/register`)
- Yangi foydalanuvchilarni ro'yxatdan o'tkazish
- Email va username validatsiyasi

### 3. Home (`/home`)
- Asosiy dashboard
- Tizim funksiyalariga tezkor kirish

### 4. Check (`/check`)
- Matnni toksiklik uchun tahlil qilish
- Batafsil natijalarni ko'rsatish
- Aniqlangan so'zlarni highlight qilish

### 5. Moderation (`/moderation`)
- Moderator va Admin uchun
- Toksik mazmunni ko'rib chiqish va tasdiqlash/rad etish

### 6. Results (`/results`)
- Barcha tahlil natijalarini ko'rish
- Filterlash va qidiruv imkoniyati

### 7. Admin (`/admin`)
- Admin panel
- Tizim statistikasi
- Foydalanuvchilarni boshqarish

## API Integration

Har bir page uchun alohida `_api.ts` fayli mavjud bo'lib, unda:

- API endpoint chaqiruvlari
- TypeScript type safety
- Error handling
- Token management

Misol:

```typescript
// pages/Login/_api.ts
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};
```

## Type Safety

Barcha API javoblari `src/types/api.ts` da TypeScript interface'lari bilan ta'minlangan:

- `LoginResponse`
- `ToxicityAnalysisResult`
- `ModerationItem`
- `AdminDashboardResponse`
- va boshqalar...

## Authentication

- JWT token bilan himoyalangan
- Token `localStorage`da saqlanadi
- Axios interceptor orqali avtomatik yuboriladi
- 401 xato holatlarda avtomatik logout

## Role-based Access

- `user` - Oddiy foydalanuvchi
- `moderator` - Moderator (Moderation sahifasiga kirish)
- `admin` - Administrator (Barcha sahifalarga kirish)

## Styling

- CSS Custom Properties (CSS Variables)
- Sentinel Design System asosida
- Mobile-responsive dizayn
- Manrope va Inter fontlari

## Scripts

```json
{
  "dev": "vite",                    // Development server
  "build": "tsc && vite build",     // Production build
  "preview": "vite preview",        // Preview production build
  "lint": "eslint . --ext ts,tsx"   // Linting
}
```

## Browser Support

- Chrome (oxirgi 2 versiya)
- Firefox (oxirgi 2 versiya)
- Safari (oxirgi 2 versiya)
- Edge (oxirgi 2 versiya)

## License

MIT

## Muallif

Sentinel Development Team
