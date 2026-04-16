# Sentinella: Tizim Arxitekturasi va Texnik Tahlil

**Loyiha nomi:** Sentinella - Matn Toksiklik Tahlil Tizimi
**Tahlil sanasi:** 2026-04-16
**Versiya:** 1.0.0

---

## 📋 Mundarija

1. [Loyiha Umumiy Ko'rinishi](#1-loyiha-umumiy-korinishi)
2. [Frontend Arxitekturasi (React)](#2-frontend-arxitekturasi-react)
3. [Backend Arxitekturasi (NestJS)](#3-backend-arxitekturasi-nestjs)
4. [Frontend va Backend Integratsiyasi](#4-frontend-va-backend-integratsiyasi)
5. [Tashqi Servislar va Integratsiyalar](#5-tashqi-servislar-va-integratsiyalar)
6. [Ma'lumotlar Oqimi (Data Flow)](#6-malumotlar-oqimi-data-flow)
7. [Xavfsizlik Mexanizmlari](#7-xavfsizlik-mexanizmlari)
8. [Xulosa](#8-xulosa)

---

## 1. Loyiha Umumiy Ko'rinishi

### 1.1. Arxitektura Turi

Sentinella **Client-Server** arxitektura asosida qurilgan, quyidagi tuzilmaga ega:

```
┌─────────────────────────────────────────────────────────────┐
│                        FOYDALANUVCHI                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React SPA)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • React 18.2 + TypeScript                           │   │
│  │  • React Router Dom (Client-side routing)            │   │
│  │  • Axios (HTTP Client)                               │   │
│  │  • Recharts (Data Visualization)                     │   │
│  │  • Vite (Build Tool)                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS (REST API)
                         │ JSON Format
                         │ JWT Authentication
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (NestJS API)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • NestJS 10.x Framework                             │   │
│  │  • TypeScript 5.x                                    │   │
│  │  • Passport + JWT                                    │   │
│  │  • Mongoose ODM                                      │   │
│  │  • Swagger/OpenAPI                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────┬───────────────────────────┬────────────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│   MongoDB       │         │   OpenAI API     │
│   (Database)    │         │   (GPT-4o-mini)  │
└─────────────────┘         └──────────────────┘
```

### 1.2. Texnologiyalar Stack

| Qatlam | Texnologiya | Versiya | Maqsad |
|--------|-------------|---------|--------|
| **Frontend** | React | 18.2.0 | UI Framework |
| | TypeScript | 5.3.3 | Type Safety |
| | Vite | 5.0.10 | Build Tool |
| | Axios | 1.6.5 | HTTP Client |
| | React Router | 6.21.1 | Routing |
| | Recharts | 3.8.1 | Visualization |
| **Backend** | NestJS | 10.x | Framework |
| | TypeScript | 5.1.3 | Type Safety |
| | Mongoose | 8.23.0 | ODM |
| | Passport | 0.7.0 | Auth Middleware |
| | JWT | 11.0.2 | Tokenization |
| | Bcrypt | 6.0.0 | Password Hashing |
| | OpenAI SDK | 6.33.0 | AI Integration |
| **Database** | MongoDB | 6.x+ | NoSQL Database |
| **AI** | OpenAI GPT | 4o-mini | Text Analysis |

### 1.3. Loyiha Strukturasi

```
Sentinella/
├── sentinel-app/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx        # Root component
│   │   ├── main.tsx       # Entry point
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.ts
│
├── sentinel-backend/      # Backend (NestJS)
│   ├── src/
│   │   ├── main.ts        # Entry point
│   │   ├── app.module.ts  # Root module
│   │   ├── auth/          # Authentication module
│   │   ├── analysis/      # Text analysis module
│   │   ├── results/       # Results module
│   │   ├── admin/         # Admin module
│   │   ├── moderation/    # Moderation module
│   │   └── common/        # Shared utilities
│   ├── .env               # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 2. Frontend Arxitekturasi (React)

### 2.1. Frontend - Nima?

**Frontend** - bu foydalanuvchi ko'radigan va bilan ishlash amalga oshiradigan qism. Bu **brauzer**da ishlaydigan dastur (web app).

Sentinella frontendida:
- **React 18.2** - UI (User Interface) yaratish uchun JavaScript kutubxonasi
- **TypeScript** - JavaScript ga type-safety qo'shadi (xatolarni kamaytiradi)
- **Vite** - Tez development va build tool
- **Axios** - Backend bilan HTTP so'rovlar yuborish uchun

### 2.2. Frontend Tuzilishi

```
sentinel-app/src/
├── App.tsx                 # Asosiy komponent (routing)
├── main.tsx               # Entry point (dastur boshlanish nuqtasi)
├── index.css              # Global stillar
│
├── components/            # Qayta ishlatiluvchi UI komponentlar
│   ├── MainLayout.tsx     # Sahifa shablon (header + footer)
│   ├── TopAppBar.tsx      # Yuqoridagi navigatsiya paneli
│   ├── BottomNavBar.tsx   # Mobil navigatsiya (pastda)
│   ├── Footer.tsx         # Footer komponent
│   ├── Modal.tsx          # Modal dialog
│   ├── ConfirmDialog.tsx  # Tasdiqlash dialog
│   └── LoginRequired.tsx  # Login kerak xabari
│
├── pages/                 # Sahifalar (har bir route uchun)
│   ├── Login/
│   │   ├── Login.tsx      # Login sahifasi UI
│   │   └── _api.ts        # Login API chaqiruvlari
│   ├── Register/
│   │   ├── Register.tsx   # Ro'yxatdan o'tish UI
│   │   └── _api.ts        # Register API
│   ├── Home/
│   │   └── Home.tsx       # Bosh sahifa (dashboard)
│   ├── Check/
│   │   ├── Check.tsx      # Matn tahlil qilish UI
│   │   └── _api.ts        # Tahlil API
│   ├── Results/
│   │   ├── Results.tsx    # Natijalar ro'yxati
│   │   └── _api.ts        # Natijalar API
│   ├── Admin/
│   │   ├── Admin.tsx      # Admin dashboard
│   │   ├── DangerousContent.tsx
│   │   └── _api.ts        # Admin API
│   └── Moderation/
│       ├── Moderation.tsx # Moderatsiya UI
│       └── _api.ts        # Moderatsiya API
│
├── types/                 # TypeScript turlari
│   └── api.ts             # API javob turlari
│
└── utils/                 # Yordam funksiyalar
    └── axios.ts           # HTTP client konfiguratsiyasi
```

### 2.3. Frontend Asosiy Komponentlari

#### 2.3.1. App.tsx - Routing va Himoya

**Fayl:** `sentinel-app/src/App.tsx`

Bu komponent quyidagilarni amalga oshiradi:

**a) Routing (Yo'naltirish):**
```typescript
<Routes>
  {/* Ochiq sahifalar */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Himoyalangan sahifalar */}
  <Route path="/home" element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } />

  {/* Admin uchun */}
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <Admin />
    </ProtectedRoute>
  } />
</Routes>
```

**b) Authentication Guard (Autentifikatsiya himoyasi):**
```typescript
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  // Agar token yo'q bo'lsa
  if (!token) {
    return <LoginRequired />;  // Login kerak xabarini ko'rsat
  }

  // Agar rol talabi bo'lsa
  if (requiredRole) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user.role !== requiredRole) {
      return <div>Ruxsat yo'q</div>;  // Kirish taqiqlangan
    }
  }

  return children;  // Sahifani ko'rsat
};
```

**c) Public Route (Ommaviy yo'nalish):**
```typescript
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Agar allaqachon login qilgan bo'lsa
  if (token) {
    return <Navigate to="/home" />;  // Home ga yo'naltir
  }

  return children;
};
```

#### 2.3.2. Axios Configuration - HTTP Client

**Fayl:** `sentinel-app/src/utils/axios.ts`

Bu fayl backendga HTTP so'rovlar yuborish uchun sozlanadi:

```typescript
// 1. Base URL
const API_BASE_URL = 'http://localhost:5001/api';

// 2. Axios instance yaratish
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // 10 soniya
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor - har bir so'rovga token qo'shish
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Response Interceptor - xatolarni boshqarish
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token muddati tugagan
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 2.3.3. API Call Misoli

**Fayl:** `sentinel-app/src/pages/Check/_api.ts`

```typescript
export const analyzeText = async (analysisData) => {
  try {
    // Backend ga POST so'rov yuborish
    const response = await apiClient.post(
      '/analysis/check',    // Endpoint
      analysisData          // Request body: {text: "..."}
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Xatolik');
  }
};
```

### 2.4. Frontend State Management

Frontend **Local State Management** strategiyasini ishlatadi:

**a) useState - Komponent holati:**
```typescript
const [text, setText] = useState('');          // Matn input
const [loading, setLoading] = useState(false); // Yuklanish holati
const [result, setResult] = useState(null);    // Tahlil natijasi
```

**b) localStorage - Ma'lumotlarni saqlash:**
```typescript
// Saqlash
localStorage.setItem('token', 'eyJhbGci...');
localStorage.setItem('user', JSON.stringify(userObject));

// O'qish
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// O'chirish
localStorage.removeItem('token');
```

**c) useEffect - Side effects:**
```typescript
useEffect(() => {
  // Komponent yuklanganda ishga tushadi
  const fetchData = async () => {
    const data = await apiCall();
    setData(data);
  };
  fetchData();
}, []);  // [] = faqat birinchi marta
```

---

## 3. Backend Arxitekturasi (NestJS)

### 3.1. Backend - Nima?

**Backend** - bu serverda ishlaydigan qism. Bu:
- Ma'lumotlar bazasi bilan ishlaydi
- API (Application Programming Interface) taqdim etadi
- Business logikani bajaradi
- Xavfsizlikni ta'minlaydi

Sentinella backendida:
- **NestJS 10.x** - Node.js uchun progressive framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL ma'lumotlar bazasi
- **Mongoose** - MongoDB bilan ishlash uchun ODM (Object Data Modeling)
- **Passport + JWT** - Autentifikatsiya va avtorizatsiya
- **OpenAI SDK** - Sun'iy intellekt integratsiyasi

### 3.2. Backend Tuzilishi

```
sentinel-backend/src/
├── main.ts                      # Entry point (dastur boshlanish nuqtasi)
├── app.module.ts                # Root module (asosiy modul)
├── app.controller.ts            # Root controller
├── app.service.ts               # Root service
│
├── auth/                        # Autentifikatsiya moduli
│   ├── auth.controller.ts       # Login/Register endpointlari
│   ├── auth.service.ts          # Auth business logika
│   ├── users.service.ts         # User CRUD operatsiyalari
│   ├── guards/
│   │   ├── jwt-auth.guard.ts    # JWT tekshiruvi
│   │   └── roles.guard.ts       # Rol asosida kirish
│   ├── strategies/
│   │   └── jwt.strategy.ts      # Passport JWT strategiya
│   ├── schemas/
│   │   └── user.schema.ts       # User MongoDB model
│   └── auth.module.ts
│
├── analysis/                    # Matn tahlili moduli
│   ├── analysis.controller.ts   # Tahlil endpointlari
│   ├── analysis.service.ts      # Tahlil logikasi
│   ├── openai.service.ts        # OpenAI integratsiyasi
│   ├── schemas/
│   │   └── analysis.schema.ts   # Analysis MongoDB model
│   └── analysis.module.ts
│
├── results/                     # Natijalar moduli
│   ├── results.controller.ts    # Natijalar endpointlari
│   ├── results.service.ts       # Natijalar logikasi
│   └── results.module.ts
│
├── admin/                       # Admin moduli
│   ├── admin.controller.ts      # Admin endpointlari
│   ├── admin.service.ts         # Admin logikasi
│   └── admin.module.ts
│
├── moderation/                  # Moderatsiya moduli
│   ├── moderation.controller.ts # Moderatsiya endpointlari
│   ├── moderation.service.ts    # Moderatsiya logikasi
│   ├── schemas/
│   │   └── moderation.schema.ts # Moderation model
│   └── moderation.module.ts
│
└── common/                      # Umumiy fayllar
    └── middleware/
        └── logger.middleware.ts # HTTP so'rovlarni log qilish
```

### 3.3. Backend Asosiy Komponentlari

#### 3.3.1. Main.ts - Application Bootstrap

**Fayl:** `sentinel-backend/src/main.ts`

Bu fayl dasturni ishga tushiradi:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS yoqish (Frontend bilan aloqa uchun)
  app.enableCors();

  // 2. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,     // Faqat DTO da ko'rsatilgan fieldlar
      transform: true,     // Avtomatik type conversion
    })
  );

  // 3. Global Prefix
  app.setGlobalPrefix('api');  // Barcha route lar /api bilan

  // 4. Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Sentinel API')
    .setDescription('REST API dokumentatsiyasi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 5. Server ishga tushirish
  const port = 5001;
  await app.listen(port);

  console.log(`Server: http://localhost:${port}`);
  console.log(`API Docs: http://localhost:${port}/api-docs`);
}
bootstrap();
```

#### 3.3.2. App Module - Dependency Injection

**Fayl:** `sentinel-backend/src/app.module.ts`

Bu modul barcha boshqa modullarni birlashtiradi:

```typescript
@Module({
  imports: [
    // 1. ConfigModule - .env fayldan o'qish
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. MongooseModule - MongoDB ga ulanish
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // 3. Feature modullar
    AuthModule,        // Autentifikatsiya
    AnalysisModule,    // Matn tahlili
    ResultsModule,     // Natijalar
    AdminModule,       // Admin panel
    ModerationModule,  // Moderatsiya
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // LoggerMiddleware ni barcha route larga qo'llash
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

#### 3.3.3. Controller Misoli - Analysis

**Fayl:** `sentinel-backend/src/analysis/analysis.controller.ts`

Controller - bu HTTP endpointlarni boshqaradi:

```typescript
@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService
  ) {}

  // POST /api/analysis/check
  @Post('check')
  @UseGuards(JwtAuthGuard)  // JWT tekshiruvi
  async analyzeText(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @Request() req,
  ) {
    // 1. User ID ni tokendan olish
    const userId = req.user._id.toString();

    // 2. Service ni chaqirish
    const data = await this.analysisService.analyzeText({
      ...createAnalysisDto,
      userId,
    });

    // 3. Response qaytarish
    return {
      success: true,
      message: 'Tahlil muvaffaqiyatli bajarildi',
      data,
    };
  }

  // GET /api/analysis/history
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getUserHistory(
    @Request() req,
    @Query() queryDto: QueryAnalysisDto
  ) {
    const userId = req.user._id.toString();
    const data = await this.analysisService.getUserHistory(userId, queryDto);

    return {
      success: true,
      message: 'Tarix muvaffaqiyatli yuklandi',
      data,
    };
  }
}
```

### 3.4. NestJS Modulli Arxitektura

NestJS **Modular Architecture** dan foydalanadi:

```
┌─────────────────────────────────────────────┐
│              App Module (Root)              │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  ConfigModule (Global)             │    │
│  │  - .env faylni o'qish              │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │  MongooseModule                    │    │
│  │  - MongoDB connection              │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth    │  │ Analysis │  │ Results  │ │
│  │  Module  │  │  Module  │  │  Module  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│                                             │
│  ┌──────────┐  ┌──────────┐                │
│  │  Admin   │  │Moderation│                │
│  │  Module  │  │  Module  │                │
│  └──────────┘  └──────────┘                │
└─────────────────────────────────────────────┘
```

**Har bir modul:**
- **Controller** - HTTP so'rovlarni qabul qiladi
- **Service** - Business logika (asosiy funksiyalar)
- **Schema** - Ma'lumotlar bazasi modeli
- **DTO** - Data Transfer Object (validatsiya)

---

## 4. Frontend va Backend Integratsiyasi

### 4.1. Qanday bog'langan?

Frontend va Backend **HTTP protokol** orqali bog'langan:

```
┌──────────────────────────────────────────────────────────┐
│                  COMMUNICATION FLOW                      │
└──────────────────────────────────────────────────────────┘

[Frontend - Browser]
       │
       │ 1. User action (tugma bosish, forma yuborish)
       │
       ▼
   (JavaScript)
       │
       │ 2. API function chaqiruv
       │    analyzeText({text: "..."})
       │
       ▼
   (axios.post)
       │
       │ 3. HTTP Request
       │    POST http://localhost:5001/api/analysis/check
       │    Headers: {
       │      Authorization: "Bearer eyJhbGci...",
       │      Content-Type: "application/json"
       │    }
       │    Body: {
       │      "text": "Matn kiritiladi"
       │    }
       │
       │
       │ ═══════ INTERNET / LOCALHOST ═══════
       │
       │
       ▼
[Backend - Server]
       │
       │ 4. Request qabul qilish
       │    AnalysisController.analyzeText()
       │
       ▼
   (JWT Guard)
       │
       │ 5. Token tekshiruv
       │    - Token valid mi?
       │    - User mavjudmi?
       │    - Bloklangan emas mi?
       │
       ▼
   (Controller)
       │
       │ 6. Service chaqiruv
       │    analysisService.analyzeText()
       │
       ▼
   (Service)
       │
       │ 7. OpenAI ga so'rov
       │    openaiService.analyzeToxicity()
       │
       ▼
   (OpenAI API)
       │
       │ 8. AI tahlil
       │    GPT-4o-mini model
       │
       ▼
   (Service)
       │
       │ 9. MongoDB ga saqlash
       │    analysisModel.create(...)
       │
       ▼
   (Controller)
       │
       │ 10. HTTP Response
       │     Status: 200 OK
       │     Body: {
       │       "success": true,
       │       "message": "Tahlil bajarildi",
       │       "data": {
       │         "toxicityLevel": "xavfsiz",
       │         "toxicityScore": 15.5,
       │         ...
       │       }
       │     }
       │
       │
       │ ═══════ INTERNET / LOCALHOST ═══════
       │
       │
       ▼
[Frontend - Browser]
       │
       │ 11. Response qabul qilish
       │     setResult(response.data)
       │
       ▼
   (React State)
       │
       │ 12. UI yangilash
       │     - Natijalarni ko'rsatish
       │     - Loading ni o'chirish
       │
       ▼
   (User ko'radi)
```

### 4.2. Authentication Flow (Autentifikatsiya Oqimi)

```
┌──────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                     │
└──────────────────────────────────────────────────────────┘

1. USER LOGIN
   │
   ▼
   Frontend: Email va parol kiritish
   │
   ▼
   POST /api/auth/login
   Body: {
     "email": "user@example.com",
     "password": "parol123"
   }
   │
   │ ═══════ HTTP REQUEST ═══════
   │
   ▼
2. Backend: AuthService.validateUser()
   │
   ├─► MongoDB dan foydalanuvchini topish (email bo'yicha)
   │
   ├─► Parolni tekshirish
   │   bcrypt.compare(kiritilgan_parol, bazadagi_hash)
   │
   ├─► Agar to'g'ri bo'lsa ▼
   │
   ├─► JWT Token yaratish
   │   Payload: {
   │     _id: "507f1f77bcf86cd799439011",
   │     email: "user@example.com",
   │     role: "user"
   │   }
   │   Secret: JWT_SECRET (.env dan)
   │   Expiry: 7 kun
   │
   ▼
3. Response
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "507f...",
       "name": "User",
       "email": "user@example.com",
       "role": "user"
     }
   }
   │
   │ ═══════ HTTP RESPONSE ═══════
   │
   ▼
4. Frontend: Token saqlash
   │
   ├─► localStorage.setItem('token', token)
   │
   └─► localStorage.setItem('user', JSON.stringify(user))
   │
   ▼
5. KEYINGI SO'ROVLAR
   │
   ├─► axios interceptor avtomatik qo'shadi:
   │   Headers: {
   │     Authorization: "Bearer eyJhbGci..."
   │   }
   │
   ▼
6. Backend: JWT Guard
   │
   ├─► Token ni decode qilish
   │
   ├─► Signature tekshirish (JWT_SECRET bilan)
   │
   ├─► Expiry tekshirish
   │
   ├─► User ni bazadan topish
   │
   └─► req.user = user (so'rovga qo'shish)
```

### 4.3. Request-Response Format

#### Misol 1: Login Request

```http
POST /api/auth/login HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "parol123"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBhMTIz...",
  "user": {
    "id": "660a1234567890abcdef1234",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "blocked": false
  }
}
```

#### Misol 2: Text Analysis Request

```http
POST /api/analysis/check HTTP/1.1
Host: localhost:5001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "text": "Bu juda yomon gap va sen hech narsani tushinmaysan!"
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Tahlil muvaffaqiyatli bajarildi",
  "data": {
    "id": "660a1234567890abcdef5678",
    "originalText": "Bu juda yomon gap va sen hech narsani tushinmaysan!",
    "toxicityLevel": "toksik",
    "toxicityScore": 82.5,
    "aggressionScore": 75,
    "offenseScore": 85,
    "threatScore": 45,
    "detectedWords": [
      {
        "word": "yomon",
        "position": 8,
        "severity": "medium"
      },
      {
        "word": "hech narsani",
        "position": 26,
        "severity": "high"
      }
    ],
    "timestamp": "2024-03-26T10:30:00.000Z",
    "userId": "660a1111111111111111111"
  }
}
```

---

## 5. Tashqi Servislar va Integratsiyalar

### 5.1. OpenAI API - Sun'iy Intellekt

Sentinella matnlarni tahlil qilish uchun **OpenAI GPT-4o-mini** modelidan foydalanadi.

#### 5.1.1. Nima uchun OpenAI?

- **Yuqori aniqlik**: GPT modellari natural language understanding da eng yaxshilardan
- **O'zbek tilini tushunadi**: Multilingual model
- **Tez**: GPT-4o-mini - tez va arzon
- **Strukturali javob**: JSON format

#### 5.1.2. Qanday ishlaydi?

**Fayl:** `sentinel-backend/src/analysis/openai.service.ts`

```typescript
async analyzeToxicity(text: string) {
  // 1. Prompt tayyorlash
  const prompt = `
    Sen o'zbek tilida matnlarning toksiklik darajasini
    aniqlaydigan AI assistantsan.

    Quyidagi matnni tahlil qil:
    "${text}"

    Tahlil mezonlari:
    1. toxicityScore (0-100): Umumiy toksiklik
    2. aggressionScore (0-100): Tajovuz
    3. offenseScore (0-100): Haqorat
    4. threatScore (0-100): Tahdid
    5. detectedWords: Toksik so'zlar

    Javobni faqat JSON formatida ber
  `;

  // 2. OpenAI ga so'rov yuborish
  const completion = await this.openai.chat.completions.create({
    model: 'gpt-4o-mini',         // Model
    messages: [
      {
        role: 'system',
        content: "Sen matn toksikligini aniqlaydigan tahlilchisan"
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,              // Past = aniqroq
    max_tokens: 500,               // Maksimal javob uzunligi
    response_format: { type: 'json_object' }  // JSON javob
  });

  // 3. Javobni parse qilish
  const analysis = JSON.parse(completion.choices[0].message.content);

  // 4. Toxicity level aniqlash
  let toxicityLevel;
  if (analysis.toxicityScore < 30) {
    toxicityLevel = 'xavfsiz';
  } else if (analysis.toxicityScore < 70) {
    toxicityLevel = 'shubhali';
  } else {
    toxicityLevel = 'toksik';
  }

  return {
    toxicityLevel,
    toxicityScore: analysis.toxicityScore,
    aggressionScore: analysis.aggressionScore,
    offenseScore: analysis.offenseScore,
    threatScore: analysis.threatScore,
    detectedWords: analysis.detectedWords
  };
}
```

#### 5.1.3. OpenAI API Call Flow

```
┌──────────────────────────────────────────────────────────┐
│                    OpenAI API FLOW                       │
└──────────────────────────────────────────────────────────┘

1. User matn kiritadi
   "Bu juda yomon gap!"
   │
   ▼
2. Frontend → Backend
   POST /api/analysis/check
   │
   ▼
3. Backend: AnalysisService
   │
   ├─► OpenAIService.analyzeToxicity()
   │
   ▼
4. Prompt tayyorlash
   "Sen matn toksikligini aniqlaydigan AI..."
   │
   ▼
5. OpenAI API ga so'rov
   │
   ├─► URL: https://api.openai.com/v1/chat/completions
   │
   ├─► Headers: {
   │     Authorization: "Bearer sk-...",
   │     Content-Type: "application/json"
   │   }
   │
   └─► Body: {
         model: "gpt-4o-mini",
         messages: [...],
         temperature: 0.3,
         response_format: {type: "json_object"}
       }
   │
   │ ═══════ INTERNET (OpenAI Serverlari) ═══════
   │
   ▼
6. OpenAI AI tahlil qiladi
   │
   ├─► GPT model matnni tahlil qiladi
   │
   └─► JSON javob yaratadi
   │
   ▼
7. OpenAI Response
   {
     "toxicityScore": 85,
     "aggressionScore": 70,
     "offenseScore": 90,
     "threatScore": 40,
     "detectedWords": [
       {word: "yomon", position: 8, severity: "medium"}
     ]
   }
   │
   │ ═══════ INTERNET ═══════
   │
   ▼
8. Backend: Response qabul qilish
   │
   ├─► JSON parse qilish
   │
   ├─► Toxicity level aniqlash
   │   (xavfsiz / shubhali / toksik)
   │
   └─► MongoDB ga saqlash
   │
   ▼
9. Frontend ga javob yuborish
```

#### 5.1.4. OpenAI Konfiguratsiya

**.env faylda:**
```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Narxlar (GPT-4o-mini):**
- Input: $0.15 / 1M tokens (~750K so'z)
- Output: $0.60 / 1M tokens

**Misol hisob:**
- 100 so'zlik matn tahlil ≈ 150 tokens
- 1000 tahlil ≈ 150,000 tokens ≈ $0.02 (input) + $0.09 (output) = **$0.11**

### 5.2. MongoDB - Ma'lumotlar Bazasi

MongoDB **NoSQL Document Database** - bu relatsion bo'lmagan ma'lumotlar bazasi.

#### 5.2.1. Nima uchun MongoDB?

- **Flexible Schema**: Har xil turdagi ma'lumotlarni saqlash
- **JSON-like format**: JavaScript/TypeScript bilan oson ishlash
- **Scalable**: Katta hajmdagi ma'lumotlar uchun
- **Fast**: Tez o'qish/yozish

#### 5.2.2. Collections (Jadvallar)

**1. users - Foydalanuvchilar**

```javascript
{
  _id: ObjectId("660a1234567890abcdef1234"),
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$abcdefgh...",  // Bcrypt hash
  role: "user",                     // user | moderator | admin
  blocked: false,
  createdAt: ISODate("2024-03-26T10:00:00Z"),
  updatedAt: ISODate("2024-03-26T10:00:00Z")
}
```

**2. analyses - Tahlillar**

```javascript
{
  _id: ObjectId("660a5678901234abcdef5678"),
  originalText: "Bu juda yomon gap!",
  toxicityLevel: "toksik",          // xavfsiz | shubhali | toksik
  toxicityScore: 85.5,
  aggressionScore: 70,
  offenseScore: 90,
  threatScore: 40,
  detectedWords: [
    {
      word: "yomon",
      position: 8,
      severity: "medium"            // low | medium | high
    }
  ],
  userId: ObjectId("660a1234567890abcdef1234"),  // Reference to User
  createdAt: ISODate("2024-03-26T10:30:00Z"),
  updatedAt: ISODate("2024-03-26T10:30:00Z")
}
```

**3. moderations - Moderatsiya**

```javascript
{
  _id: ObjectId("660a9012345678abcdef9012"),
  content: "Shubhali matn",
  toxicityLevel: "shubhali",
  toxicityScore: 65,
  status: "pending",                // pending | approved | rejected
  submittedBy: ObjectId("660a1234..."),
  reviewedBy: null,
  reviewedAt: null,
  reviewNotes: null,
  createdAt: ISODate("2024-03-26T11:00:00Z"),
  updatedAt: ISODate("2024-03-26T11:00:00Z")
}
```

#### 5.2.3. Mongoose ODM

Mongoose - bu MongoDB bilan ishlashni osonlashtiruvchi kutubxona.

**Schema Definition:**
```typescript
// User Schema
@Schema({ timestamps: true })  // createdAt, updatedAt avtomatik
export class User {
  @Prop({ required: true, minlength: 2 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'moderator', 'admin'], default: 'user' })
  role: string;

  @Prop({ default: false })
  blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**CRUD Operations:**
```typescript
// Create
const user = await this.userModel.create({
  name: "John",
  email: "john@example.com",
  password: hashedPassword
});

// Read
const user = await this.userModel.findById(userId);
const users = await this.userModel.find({ role: 'user' });

// Update
await this.userModel.findByIdAndUpdate(userId, {
  name: "New Name"
});

// Delete
await this.userModel.findByIdAndDelete(userId);
```

#### 5.2.4. MongoDB Connection

**.env faylda:**
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/sentinella

# Cloud MongoDB (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sentinella
```

**Connection (app.module.ts):**
```typescript
MongooseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
  inject: [ConfigService],
});
```

---

## 6. Ma'lumotlar Oqimi (Data Flow)

### 6.1. Complete Flow - Matn Tahlil Qilish

```
┌──────────────────────────────────────────────────────────┐
│           TO'LIQ MA'LUMOTLAR OQIMI                       │
│         (User → Frontend → Backend → AI → DB)            │
└──────────────────────────────────────────────────────────┘

[1] USER
    ↓
    User brauzerda sentinella.com/check sahifasiga kiradi
    Matn kiritadi: "Bu juda yomon gap!"
    "Tekshirish" tugmasini bosadi

[2] FRONTEND (React Component)
    ↓
    Check.tsx → handleSubmit()
    │
    ├─► Validation: Matn bo'sh emas mi?
    ├─► setLoading(true)
    └─► analyzeText({text: "..."}) chaqiruv

[3] FRONTEND (API Layer)
    ↓
    Check/_api.ts → analyzeText()
    │
    └─► axios.post('/analysis/check', {text})

[4] HTTP REQUEST
    ↓
    POST http://localhost:5001/api/analysis/check
    Headers: {
      Authorization: "Bearer eyJhbGci...",
      Content-Type: "application/json"
    }
    Body: {
      "text": "Bu juda yomon gap!"
    }

    ║ ═══════════════════════════════════ ║
    ║       INTERNET / LOCALHOST          ║
    ║ ═══════════════════════════════════ ║

[5] BACKEND (NestJS Controller)
    ↓
    AnalysisController.analyzeText()
    │
    ├─► @UseGuards(JwtAuthGuard)
    │   └─► Token tekshirish
    │       └─► req.user = {_id, email, role}
    │
    └─► analysisService.analyzeText() chaqiruv

[6] BACKEND (Service Layer)
    ↓
    AnalysisService.analyzeText()
    │
    └─► openaiService.analyzeToxicity(text)

[7] OpenAI API CALL
    ↓
    OpenAIService.analyzeToxicity()
    │
    ├─► Prompt tayyorlash
    │
    └─► POST https://api.openai.com/v1/chat/completions
        {
          model: "gpt-4o-mini",
          messages: [{role: "user", content: prompt}],
          temperature: 0.3
        }

    ║ ═══════════════════════════════════ ║
    ║         INTERNET (OpenAI)           ║
    ║ ═══════════════════════════════════ ║

[8] OpenAI RESPONSE
    ↓
    {
      "toxicityScore": 85,
      "aggressionScore": 70,
      "offenseScore": 90,
      "threatScore": 40,
      "detectedWords": [...]
    }

[9] BACKEND (Process Results)
    ↓
    OpenAIService → Parse JSON
    │
    ├─► toxicityScore ni 0-100 oraliqda tekshirish
    │
    └─► Toxicity level aniqlash:
        if (score < 30) → "xavfsiz"
        if (score < 70) → "shubhali"
        else → "toksik"

[10] DATABASE (MongoDB)
     ↓
     analysisModel.create({
       originalText: "Bu juda yomon gap!",
       toxicityLevel: "toksik",
       toxicityScore: 85,
       aggressionScore: 70,
       offenseScore: 90,
       threatScore: 40,
       detectedWords: [...],
       userId: ObjectId("660a1234...")
     })

     ║ ═══════════════════════════════════ ║
     ║       MongoDB Server                ║
     ║ ═══════════════════════════════════ ║

[11] BACKEND RESPONSE
     ↓
     HTTP 200 OK
     {
       "success": true,
       "message": "Tahlil muvaffaqiyatli bajarildi",
       "data": {
         "id": "660a5678...",
         "originalText": "Bu juda yomon gap!",
         "toxicityLevel": "toksik",
         "toxicityScore": 85,
         "aggressionScore": 70,
         "offenseScore": 90,
         "threatScore": 40,
         "detectedWords": [
           {word: "yomon", position: 8, severity: "medium"}
         ],
         "timestamp": "2024-03-26T10:30:00Z",
         "userId": "660a1234..."
       }
     }

     ║ ═══════════════════════════════════ ║
     ║       INTERNET / LOCALHOST          ║
     ║ ═══════════════════════════════════ ║

[12] FRONTEND (Response Handler)
     ↓
     Check/_api.ts → return response.data
     │
     ▼
     Check.tsx → setResult(data)
     │
     ├─► setLoading(false)
     └─► UI yangilash

[13] USER
     ↓
     Natijalarni ko'radi:
     ✓ Toxicity badge: "TOKSIK" (qizil rang)
     ✓ Score meters: 85% (toxicity)
     ✓ Detected words: "yomon" (medium severity)
     ✓ Timestamp: "2024-03-26 10:30"
```

### 6.2. Vaqt va Performance

```
┌──────────────────────────────────────────────────────────┐
│                  PERFORMANCE METRICS                     │
└──────────────────────────────────────────────────────────┘

User Action (0ms)
    ↓
Frontend Validation (10ms)
    ↓
HTTP Request Send (20ms)
    ↓
Backend JWT Check (50ms)
    ↓
OpenAI API Call (1000-3000ms)  ← ENG SEKIN QISM
    ↓
MongoDB Save (100ms)
    ↓
HTTP Response (50ms)
    ↓
Frontend Render (50ms)
    ↓
Total: ~1300-3300ms (1.3-3.3 soniya)
```

---

## 7. Xavfsizlik Mexanizmlari

### 7.1. Password Security (Parol Xavfsizligi)

#### 7.1.1. Bcrypt Hashing

Parollar **hech qachon plain text** (oddiy matn) sifatida saqlanmaydi!

```typescript
// Registration
async register(registerDto: RegisterDto) {
  // 1. Parolni hash qilish (10 rounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Hash ni bazaga saqlash
  const user = await this.userModel.create({
    ...registerDto,
    password: hashedPassword  // Hash
  });
}
```

**Misol:**
```
Input:  "parol123"
Hash:   "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJ"
```

**Xususiyatlar:**
- **One-way**: Hash dan parolni tiklash mumkin emas
- **Salt**: Har bir parol uchun unique salt
- **Slow**: Brute-force hujumlarni qiyinlashtiradi

#### 7.1.2. Password Validation

```typescript
// Login
async validateUser(email: string, password: string) {
  // 1. User ni topish
  const user = await this.userModel.findOne({ email });

  // 2. Parolni taqqoslash
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new UnauthorizedException('Parol noto\'g\'ri');
  }

  return user;
}
```

### 7.2. JWT Authentication

#### 7.2.1. Token Structure

```
JWT Token:
┌─────────────────────────────────────────────────────────┐
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                  │  ← Header
│  .                                                       │
│  eyJfaWQiOiI2NjBhMTIzNCIsImVtYWlsIjoidXNlckBleGFt...  │  ← Payload
│  .                                                       │
│  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c          │  ← Signature
└─────────────────────────────────────────────────────────┘
```

**Decoded:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "_id": "660a1234567890abcdef1234",
    "email": "user@example.com",
    "role": "user",
    "iat": 1711450800,    // Issued at
    "exp": 1712055600     // Expires at
  },
  "signature": "..."
}
```

#### 7.2.2. Token Generation

```typescript
// auth.service.ts
private generateToken(user: User): string {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,  // .env dan
    expiresIn: '7d',                 // 7 kun
  });
}
```

#### 7.2.3. Token Validation

```typescript
// jwt.strategy.ts
async validate(payload: any) {
  // 1. User ni bazadan topish
  const user = await this.usersService.findById(payload._id);

  // 2. User mavjud va bloklangan emasligini tekshirish
  if (!user || user.blocked) {
    throw new UnauthorizedException();
  }

  // 3. req.user ga qo'shish
  return user;
}
```

### 7.3. Role-Based Access Control (RBAC)

```typescript
// Roles decorator
export const Roles = (...roles: string[]) =>
  SetMetadata('roles', roles);

// Roles guard
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get('roles', context.getHandler());

    if (!requiredRoles) {
      return true;  // Rol talab qilinmagan
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role === role);
  }
}

// Usage
@Get('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')  // Faqat admin kirishi mumkin
async getDashboard() {
  // ...
}
```

**Rollar:**
- **user** - Oddiy foydalanuvchi (tahlil qilish, natijalar ko'rish)
- **moderator** - Moderator (moderatsiya qilish)
- **admin** - Administrator (barcha huquqlar)

### 7.4. Input Validation

```typescript
// DTO (Data Transfer Object)
export class CreateAnalysisDto {
  @IsString()
  @IsNotEmpty({ message: 'Matn kiritilishi shart' })
  @MinLength(1)
  @MaxLength(5000, { message: 'Matn 5000 belgidan oshmasligi kerak' })
  text: string;
}

// Global Validation Pipe (main.ts)
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Faqat DTO fieldlar
    forbidNonWhitelisted: true,   // Extra fieldlarni rad qilish
    transform: true,              // Auto type conversion
  })
);
```

### 7.5. CORS (Cross-Origin Resource Sharing)

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

Bu frontend ga backend bilan muloqot qilishga ruxsat beradi.

### 7.6. Environment Variables (.env)

Sensitive ma'lumotlar **hech qachon kodda** bo'lmaydi!

```env
# .env fayli
PORT=5001
NODE_ENV=production

# JWT
JWT_SECRET=super_secret_key_change_in_production_12345
JWT_EXPIRE=7d

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sentinella

# OpenAI
OPENAI_API_KEY=sk-proj-1234567890abcdefgh
```

### 7.7. Security Best Practices

| Mexanizm | Tavsif | Holati |
|----------|--------|---------|
| **Password Hashing** | Bcrypt (10 rounds) | ✅ Implemented |
| **JWT Authentication** | Token-based auth | ✅ Implemented |
| **RBAC** | Role-based access | ✅ Implemented |
| **Input Validation** | class-validator | ✅ Implemented |
| **CORS** | Frontend uchun ruxsat | ✅ Implemented |
| **Environment Variables** | Sensitive data | ✅ Implemented |
| **HTTPS** | SSL/TLS encryption | ⏳ Production only |
| **Rate Limiting** | DDoS protection | 📋 Planned |
| **SQL Injection** | Mongoose ODM | ✅ Protected |
| **XSS Protection** | Input sanitization | ✅ Protected |

---

## 8. Xulosa

### 8.1. Arxitektura Xulasasi

Sentinella loyihasi zamonaviy **3-tier architecture** asosida qurilgan:

```
┌─────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                      │
│                 (Frontend - React)                      │
│  • Single Page Application (SPA)                        │
│  • Component-based UI                                   │
│  • Client-side routing                                  │
│  • State management (useState, localStorage)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (HTTP/HTTPS)
                     │ JSON Format
                     │ JWT Authentication
                     │
┌────────────────────▼────────────────────────────────────┐
│                 APPLICATION LAYER                       │
│                 (Backend - NestJS)                      │
│  • RESTful API                                          │
│  • Business Logic                                       │
│  • Authentication & Authorization                       │
│  • Data Validation                                      │
└────────┬────────────────────────┬───────────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌───────────────────┐
│   DATA LAYER    │      │  EXTERNAL APIs    │
│   (MongoDB)     │      │  (OpenAI)         │
│  • Users        │      │  • GPT-4o-mini    │
│  • Analyses     │      │  • Text Analysis  │
│  • Moderations  │      └───────────────────┘
└─────────────────┘
```

### 8.2. Asosiy Komponentlar

#### Frontend (React):
- ✅ **Component-based**: Qayta foydalanish mumkin bo'lgan komponentlar
- ✅ **Type-safe**: TypeScript orqali xatolarni kamaytirish
- ✅ **Routing**: React Router bilan sahifalar o'rtasida navigatsiya
- ✅ **HTTP Client**: Axios bilan backend ga so'rovlar
- ✅ **State Management**: useState va localStorage

#### Backend (NestJS):
- ✅ **Modular**: Har bir feature alohida modul
- ✅ **Dependency Injection**: IoC container
- ✅ **RESTful API**: Standard REST endpointlar
- ✅ **Swagger Docs**: Avtomatik API dokumentatsiyasi
- ✅ **Middleware**: Logging, CORS, Validation

#### Database (MongoDB):
- ✅ **NoSQL**: Flexible schema
- ✅ **Mongoose ODM**: Type-safe database operations
- ✅ **Collections**: Users, Analyses, Moderations
- ✅ **Indexing**: Fast queries

#### External Services:
- ✅ **OpenAI GPT-4o-mini**: AI-powered text analysis
- ✅ **JWT**: Secure authentication
- ✅ **Bcrypt**: Password hashing

### 8.3. Ma'lumotlar Oqimi (Summary)

```
User → Frontend → Backend → OpenAI → Backend → MongoDB → Backend → Frontend → User
```

**Vaqt:**
- Frontend validation: ~10ms
- HTTP request/response: ~100ms
- Backend processing: ~100ms
- OpenAI API: ~1000-3000ms
- MongoDB operations: ~100ms
- **Total: ~1.3-3.3 soniya**

### 8.4. Xavfsizlik (Summary)

| Layer | Security Mechanism |
|-------|-------------------|
| **Frontend** | • localStorage (token)<br>• Input validation<br>• Protected routes |
| **Backend** | • JWT authentication<br>• RBAC (Role-based access)<br>• Input validation<br>• CORS |
| **Database** | • Mongoose ODM (SQL injection protection)<br>• Password hashing (bcrypt) |
| **Network** | • HTTPS (production)<br>• Environment variables |

### 8.5. Texnologiyalar (Summary)

| Qatlam | Texnologiya | Vazifa |
|--------|-------------|--------|
| **Frontend** | React 18.2 + TypeScript | UI va user interaction |
| | Vite | Build va development |
| | Axios | HTTP client |
| | React Router | Routing |
| **Backend** | NestJS 10.x + TypeScript | API va business logic |
| | Passport + JWT | Authentication |
| | Mongoose | Database ORM |
| | OpenAI SDK | AI integration |
| **Database** | MongoDB | NoSQL database |
| **AI** | OpenAI GPT-4o-mini | Text analysis |

### 8.6. Afzalliklari

✅ **Scalable**: Har bir qatlam mustaqil o'sishi mumkin
✅ **Maintainable**: Modulli tuzilish, oson debug
✅ **Secure**: Ko'p qavatli xavfsizlik
✅ **Type-safe**: TypeScript orqali xatolar kamayadi
✅ **Modern**: Zamonaviy texnologiyalar va best practices
✅ **Documented**: Swagger API docs
✅ **Fast**: Optimallashtirilgan ma'lumotlar oqimi

### 8.7. Keyingi Bosqichlar

📋 **Rejalashtirilgan:**
- Rate Limiting (DDoS himoyasi)
- Email Verification
- Password Reset
- Redis Caching
- WebSocket (real-time notifications)
- Docker Deployment
- CI/CD Pipeline
- Monitoring va Logging

---

## 📚 Qo'shimcha Ma'lumotlar

### Foydali Havolalar

- **NestJS Documentation**: https://docs.nestjs.com
- **React Documentation**: https://react.dev
- **MongoDB Documentation**: https://www.mongodb.com/docs
- **OpenAI API Reference**: https://platform.openai.com/docs
- **JWT.io**: https://jwt.io

### Loyiha Fayllari

- **Frontend**: `sentinel-app/`
- **Backend**: `sentinel-backend/`
- **Backend README**: `sentinel-backend/README.md`
- **API Docs**: `http://localhost:5001/api-docs`

---

**Tahlil yaratildi:** 2026-04-16
**Versiya:** 1.0.0
**Muallif:** Sentinella Development Team
