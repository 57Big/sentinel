# Sentinella Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

Sentinella - Matnlarni toksiklik darajasini aniqlash va moderatsiya qilish uchun mo'ljallangan zamonaviy backend API servisi. OpenAI texnologiyasi bilan integratsiyalangan holda matnlarni tahlil qiladi va real-time natijalar beradi.

## 📋 Mundarija

- [Xususiyatlar](#-xususiyatlar)
- [Texnologiyalar](#-texnologiyalar)
- [Loyiha strukturasi](#-loyiha-strukturasi)
- [O'rnatish](#-ornatish)
- [Muhit sozlamalari](#-muhit-sozlamalari)
- [Ishga tushirish](#-ishga-tushirish)
- [API Dokumentatsiyasi](#-api-dokumentatsiyasi)
- [Ma'lumotlar modeli](#-malumotlar-modeli)
- [Xavfsizlik](#-xavfsizlik)
- [Testlar](#-testlar)
- [Deployment](#-deployment)

---

## ✨ Xususiyatlar

### 🔐 Autentifikatsiya va avtorizatsiya
- Foydalanuvchi ro'yxatdan o'tish va tizimga kirish
- JWT (JSON Web Token) asosidagi autentifikatsiya
- Role-based access control (RBAC): User, Moderator, Admin
- Bcrypt bilan parol shifrlash (10 rounds)
- Foydalanuvchilarni bloklash/blokdan chiqarish

### 🔍 Matn tahlili (Analysis)
- OpenAI GPT texnologiyasi orqali matnlarni tahlil qilish
- Toksiklik darajasini aniqlash (xavfsiz, shubhali, toksik)
- Toksiklik, tajovuz, haqorat va tahdid ballari (0-100)
- Toksik so'zlarni aniqlash va pozitsiyalarini ko'rsatish
- Tahlil tarixini saqlash va ko'rish
- Foydalanuvchi tahlillarini boshqarish

### 📊 Natijalar (Results)
- Foydalanuvchi o'z natijalarini ko'rish
- Admin barcha natijalarni ko'rish va boshqarish
- Sahifalash (pagination) va saralash (sorting)
- Filtr va qidiruv imkoniyatlari

### 👥 Admin panel
- Dashboard: Umumiy statistika va tahlillar
- Foydalanuvchilarni boshqarish
- Rol o'zgartirish (user → moderator → admin)
- Foydalanuvchilarni bloklash va o'chirish
- Tizim sozlamalarini boshqarish
- Haftalik statistika va grafiklar
- So'nggi xavfli matnlar ro'yxati

### 🛡️ Moderatsiya
- Moderatsiya kutish ro'yxati
- Moderatsiya statistikasi
- Matnlarni tasdiqlash/rad etish
- Moderator eslatmalari qo'shish
- Status bo'yicha filterlash

---

## 🚀 Texnologiyalar

### Backend Framework
- **NestJS 10.x** - Progressive Node.js framework
- **TypeScript 5.x** - Type-safe JavaScript

### Ma'lumotlar bazasi
- **MongoDB** - NoSQL database
- **Mongoose 8.x** - ODM (Object Data Modeling)

### Autentifikatsiya
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing

### AI & Tahlil
- **OpenAI API** - GPT-powered text analysis
- AI orqali toksiklik aniqlash

### Validatsiya va dokumentatsiya
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **Swagger/OpenAPI** - API documentation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

---

## 📁 Loyiha strukturasi

```
sentinella-backend/
├── src/
│   ├── analysis/                     # Matn tahlili moduli
│   │   ├── dto/
│   │   │   ├── create-analysis.dto.ts
│   │   │   └── query-analysis.dto.ts
│   │   ├── interfaces/
│   │   │   └── analysis-response.interface.ts
│   │   ├── schemas/
│   │   │   └── analysis.schema.ts    # MongoDB schema
│   │   ├── analysis.controller.ts    # API endpoints
│   │   ├── analysis.service.ts       # Business logic
│   │   ├── openai.service.ts         # OpenAI integration
│   │   └── analysis.module.ts
│   │
│   ├── auth/                         # Autentifikatsiya moduli
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts    # Custom decorator
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts        # User model
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   └── auth.module.ts
│   │
│   ├── results/                      # Natijalar moduli
│   │   ├── dto/
│   │   │   └── query-results.dto.ts
│   │   ├── interfaces/
│   │   │   └── results-response.interface.ts
│   │   ├── results.controller.ts
│   │   ├── results.service.ts
│   │   └── results.module.ts
│   │
│   ├── admin/                        # Admin panel moduli
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   └── admin.module.ts
│   │
│   ├── moderation/                   # Moderatsiya moduli
│   │   ├── dto/
│   │   │   ├── moderation-action.dto.ts
│   │   │   └── moderation-list.dto.ts
│   │   ├── schemas/
│   │   │   └── moderation.schema.ts
│   │   ├── moderation.controller.ts
│   │   ├── moderation.service.ts
│   │   └── moderation.module.ts
│   │
│   ├── common/                       # Umumiy fayllar
│   │   └── middleware/
│   │       └── logger.middleware.ts  # HTTP request logger
│   │
│   ├── app.module.ts                 # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                       # Entry point
│
├── dist/                             # Compiled JavaScript
├── test/                             # Test files
├── .env                              # Environment variables
├── .env.example                      # Environment template
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 📦 O'rnatish

### 1. Talablar

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 6.x (lokal yoki cloud)
- **OpenAI API Key** (optional, tahlil uchun kerak)

### 2. Loyihani klonlash

```bash
cd sentinella-backend
```

### 3. Paketlarni o'rnatish

```bash
npm install
```

---

## ⚙️ Muhit sozlamalari

`.env.example` faylidan nusxa oling:

```bash
cp .env.example .env
```

`.env` faylini tahrirlang:

```env
# Server sozlamalari
PORT=5001
NODE_ENV=development

# JWT sozlamalari
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sentinella

# OpenAI (tahlil uchun)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Muhim eslatmalar:

- **JWT_SECRET**: Production muhitida qattiq va murakkab kalit ishlating
- **MONGODB_URI**: MongoDB cloud (Atlas) yoki lokal server manzili
- **OPENAI_API_KEY**: [OpenAI Platform](https://platform.openai.com/api-keys) dan oling

---

## 🏃 Ishga tushirish

### Development rejimda (hot reload)

```bash
npm run start:dev
```

Server `http://localhost:5001` manzilida ishga tushadi.

### Production build

```bash
# Build qilish
npm run build

# Production rejimda ishga tushirish
npm run start:prod
```

### Debug rejimda

```bash
npm run start:debug
```

Debug port: `9229` (Chrome DevTools yoki VS Code debugger bilan ulanish mumkin)

### Server ishga tushgandan keyin:

```
🚀 Server ishlamoqda: http://localhost:5001
📚 API Dokumentatsiyasi: http://localhost:5001/api-docs
📝 API Prefix: http://localhost:5001/api
```

---

## 📚 API Dokumentatsiyasi

### Swagger UI

Serveringiz ishga tushgandan so'ng, quyidagi manzilga o'ting:

```
http://localhost:5001/api-docs
```

Bu yerda barcha endpointlarni interaktiv tarzda sinab ko'rishingiz mumkin.

---

## 🔌 API Endpointlar

### 🔐 Authentication (`/api/auth`)

#### 1. Ro'yxatdan o'tish

**POST** `/api/auth/register`

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shamshod Yusupov",
    "email": "shamshod@example.com",
    "password": "parol123"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Shamshod Yusupov",
    "email": "shamshod@example.com",
    "role": "user",
    "blocked": false,
    "createdAt": "2024-03-26T10:30:00.000Z"
  }
}
```

#### 2. Tizimga kirish

**POST** `/api/auth/login`

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shamshod@example.com",
    "password": "parol123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Shamshod Yusupov",
    "email": "shamshod@example.com",
    "role": "user",
    "blocked": false
  }
}
```

---

### 🔍 Analysis (`/api/analysis`)

> **Eslatma:** Barcha analysis endpointlari JWT autentifikatsiyani talab qiladi.
> Header: `Authorization: Bearer YOUR_JWT_TOKEN`

#### 1. Matnni tahlil qilish

**POST** `/api/analysis/check`

```bash
curl -X POST http://localhost:5001/api/analysis/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "text": "Bu juda yaxshi va ajoyib fikr!"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli bajarildi",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "originalText": "Bu juda yaxshi va ajoyib fikr!",
    "toxicityLevel": "xavfsiz",
    "toxicityScore": 5.2,
    "aggressionScore": 0,
    "offenseScore": 0,
    "threatScore": 0,
    "detectedWords": [],
    "timestamp": "2024-03-26T10:35:00.000Z",
    "userId": "65f1a2b3c4d5e6f7g8h9i0j1"
  }
}
```

#### 2. Tahlil tarixini olish

**GET** `/api/analysis/history?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc`

```bash
curl -X GET "http://localhost:5001/api/analysis/history?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tarix muvaffaqiyatli yuklandi",
  "data": {
    "results": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "text": "Bu juda yaxshi va ajoyib fikr!",
        "toxicityLevel": "xavfsiz",
        "toxicityScore": 5.2,
        "analyzedAt": "2024-03-26T10:35:00.000Z",
        "detectedWords": []
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 3. Tahlilni ID bo'yicha olish

**GET** `/api/analysis/:id`

```bash
curl -X GET http://localhost:5001/api/analysis/65f1a2b3c4d5e6f7g8h9i0j2
```

#### 4. Tahlilni o'chirish

**DELETE** `/api/analysis/:id`

```bash
curl -X DELETE http://localhost:5001/api/analysis/65f1a2b3c4d5e6f7g8h9i0j2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 📊 Results (`/api/results`)

> **Eslatma:** JWT autentifikatsiya talab qilinadi.

#### 1. Foydalanuvchining o'z natijalarini olish

**GET** `/api/results/list?page=1&pageSize=10`

```bash
curl -X GET "http://localhost:5001/api/results/list?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2. Barcha natijalarni olish (faqat Admin)

**GET** `/api/results/all?page=1&pageSize=10`

> **Role:** Admin

```bash
curl -X GET "http://localhost:5001/api/results/all?page=1&pageSize=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### 3. Foydalanuvchi natijalarini olish

**GET** `/api/results/user/:userId?page=1&pageSize=10`

```bash
curl -X GET "http://localhost:5001/api/results/user/65f1a2b3c4d5e6f7g8h9i0j1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 👥 Admin (`/api/admin`)

> **Eslatma:** Barcha admin endpointlari faqat `admin` roli uchun.
> Header: `Authorization: Bearer ADMIN_JWT_TOKEN`

#### 1. Dashboard ma'lumotlari

**GET** `/api/admin/dashboard`

```bash
curl -X GET http://localhost:5001/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard ma'lumotlari yuklandi",
  "data": {
    "totalUsers": 1250,
    "totalAnalyses": 45000,
    "toxicCount": 3500,
    "suspiciousCount": 8900,
    "safeCount": 32600,
    "activeUsers": 350,
    "newUsersToday": 25
  }
}
```

#### 2. Barcha foydalanuvchilar

**GET** `/api/admin/users?page=1&pageSize=10&search=shamshod&role=user`

```bash
curl -X GET "http://localhost:5001/api/admin/users?page=1&pageSize=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### 3. Foydalanuvchi rolini o'zgartirish

**PATCH** `/api/admin/users/:userId/role`

```bash
curl -X PATCH http://localhost:5001/api/admin/users/65f1a2b3c4d5e6f7g8h9i0j1/role \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "moderator"}'
```

#### 4. Foydalanuvchini bloklash/blokdan chiqarish

**PATCH** `/api/admin/users/:userId/block`

```bash
curl -X PATCH http://localhost:5001/api/admin/users/65f1a2b3c4d5e6f7g8h9i0j1/block \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"blocked": true}'
```

#### 5. Foydalanuvchini o'chirish

**DELETE** `/api/admin/users/:userId`

```bash
curl -X DELETE http://localhost:5001/api/admin/users/65f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### 6. Tizim sozlamalari

**GET** `/api/admin/settings`

```bash
curl -X GET http://localhost:5001/api/admin/settings \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**PUT** `/api/admin/settings`

```bash
curl -X PUT http://localhost:5001/api/admin/settings \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxTextLength": 5000,
    "toxicityThreshold": 70
  }'
```

#### 7. Haftalik statistika

**GET** `/api/admin/weekly-statistics?days=7`

```bash
curl -X GET "http://localhost:5001/api/admin/weekly-statistics?days=7" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### 8. So'nggi xavfli matnlar

**GET** `/api/admin/recent-dangerous?limit=10`

```bash
curl -X GET "http://localhost:5001/api/admin/recent-dangerous?limit=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

---

### 🛡️ Moderation (`/api/moderation`)

> **Role:** Moderator yoki Admin

#### 1. Moderatsiya ro'yxati

**GET** `/api/moderation/list?page=1&pageSize=10&status=pending`

```bash
curl -X GET "http://localhost:5001/api/moderation/list?status=pending" \
  -H "Authorization: Bearer MODERATOR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Moderatsiya ro'yxati yuklandi",
  "data": {
    "items": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j3",
        "content": "Bu juda yomon gap",
        "toxicityLevel": "toksik",
        "toxicityScore": 85.5,
        "status": "pending",
        "submittedBy": "user@example.com",
        "submittedAt": "2024-03-26T10:30:00.000Z",
        "reviewedBy": null,
        "reviewedAt": null,
        "reviewNotes": null
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 2. Moderatsiya statistikasi

**GET** `/api/moderation/stats`

```bash
curl -X GET http://localhost:5001/api/moderation/stats \
  -H "Authorization: Bearer MODERATOR_JWT_TOKEN"
```

#### 3. Element bo'yicha ma'lumot

**GET** `/api/moderation/item/:itemId`

```bash
curl -X GET http://localhost:5001/api/moderation/item/65f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer MODERATOR_JWT_TOKEN"
```

#### 4. Moderatsiya harakati (tasdiqlash/rad etish)

**POST** `/api/moderation/action`

```bash
curl -X POST http://localhost:5001/api/moderation/action \
  -H "Authorization: Bearer MODERATOR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "65f1a2b3c4d5e6f7g8h9i0j3",
    "action": "approved",
    "notes": "False positive, tasdiqlandi"
  }'
```

#### 5. Elementni o'chirish

**DELETE** `/api/moderation/:itemId`

```bash
curl -X DELETE http://localhost:5001/api/moderation/65f1a2b3c4d5e6f7g8h9i0j3 \
  -H "Authorization: Bearer MODERATOR_JWT_TOKEN"
```

---

## 📊 Ma'lumotlar modeli

### User Schema

```typescript
{
  _id: ObjectId,
  name: string,           // Kamida 2 ta belgi
  email: string,          // Unique, lowercase
  password: string,       // Bcrypt hash
  role: enum,             // 'user' | 'moderator' | 'admin'
  blocked: boolean,       // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Analysis Schema

```typescript
{
  _id: ObjectId,
  originalText: string,
  toxicityLevel: enum,          // 'xavfsiz' | 'shubhali' | 'toksik'
  toxicityScore: number,        // 0-100
  aggressionScore: number,      // 0-100
  offenseScore: number,         // 0-100
  threatScore: number,          // 0-100
  detectedWords: [
    {
      word: string,
      position: number,
      severity: enum            // 'low' | 'medium' | 'high'
    }
  ],
  userId: ObjectId,             // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Moderation Schema

```typescript
{
  _id: ObjectId,
  content: string,
  toxicityLevel: string,
  toxicityScore: number,
  status: enum,                 // 'pending' | 'approved' | 'rejected'
  submittedBy: ObjectId,        // User ID
  submittedAt: Date,
  reviewedBy: ObjectId,         // Moderator ID
  reviewedAt: Date,
  reviewNotes: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Xavfsizlik

### Parol xavfsizligi
- Bcrypt bilan hashing (10 salt rounds)
- Minimum 6 ta belgi talab qilinadi
- Parollar hech qachon plain text sifatida saqlanmaydi

### JWT Autentifikatsiya
- Access token 7 kun amal qiladi (sozlanishi mumkin)
- Bearer token formatida yuboriladi
- Har bir protected endpoint JWT guard orqali himoyalangan

### CORS
- Cross-Origin Resource Sharing yoqilgan
- Frontend uchun kerakli headerlar ruxsat berilgan

### Validatsiya
- class-validator orqali barcha inputlar tekshiriladi
- Whitelist rejimi: faqat DTO'da belgilangan fieldlar qabul qilinadi
- Transform: Ma'lumotlar avtomatik to'g'ri turga o'giriladi

### Rate Limiting
- (Rejalashtirilgan) So'rovlar sonini cheklash
- DDoS hujumlardan himoya

### MongoDB Injection Protection
- Mongoose ODM orqali barcha query'lar xavfsiz
- Input sanitization

---

## 🧪 Testlar

### Unit testlar

```bash
npm run test
```

### E2E testlar

```bash
npm run test:e2e
```

### Test coverage

```bash
npm run test:cov
```

Coverage report `coverage/` papkasida yaratiladi.

---

## 🛠️ Development Scripts

```bash
# Development rejimda ishga tushirish (hot reload)
npm run start:dev

# Production build
npm run build

# Production rejimda ishga tushirish
npm run start:prod

# Debug rejimda ishga tushirish
npm run start:debug

# Code formatlash (Prettier)
npm run format

# Linting (ESLint)
npm run lint

# Unit testlar
npm run test

# E2E testlar
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📦 Deployment

### 1. Production build

```bash
npm run build
```

### 2. Environment o'zgaruvchilarini sozlash

Production serverda `.env` faylini to'g'ri sozlang:

```env
PORT=5001
NODE_ENV=production
JWT_SECRET=super_secure_secret_key_for_production
JWT_EXPIRE=7d
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sentinella
OPENAI_API_KEY=sk-your-production-openai-key
```

### 3. PM2 bilan ishga tushirish (tavsiya etiladi)

```bash
# PM2 o'rnatish
npm install -g pm2

# Ilovani ishga tushirish
pm2 start dist/main.js --name sentinella-backend

# Auto-restart sozlash
pm2 startup
pm2 save

# Loglarni ko'rish
pm2 logs sentinella-backend

# Statusni ko'rish
pm2 status
```

### 4. Nginx reverse proxy (optional)

```nginx
server {
    listen 80;
    server_name api.sentinella.uz;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Docker bilan deploy (optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5001

CMD ["node", "dist/main"]
```

```bash
# Docker image yaratish
docker build -t sentinella-backend .

# Container ishga tushirish
docker run -d -p 5001:5001 --env-file .env sentinella-backend
```

---

## 📝 API Request Logging

Barcha HTTP requestlar terminalda quyidagi formatda ko'rinadi:

```
[HTTP] POST /api/auth/register 201 77ms - curl/8.7.1 ::1
[HTTP] POST /api/auth/login 200 70ms - PostmanRuntime/7.32.3 ::1
[HTTP] GET /api/analysis/history 200 125ms - Mozilla/5.0 192.168.1.100
```

Format: `METHOD URL STATUS_CODE RESPONSE_TIME - USER_AGENT IP`

---

## ⚠️ Xatolik kodlari

| Kod | Ma'nosi | Tavsif |
|-----|---------|--------|
| 200 | OK | So'rov muvaffaqiyatli bajarildi |
| 201 | Created | Yangi resurs yaratildi |
| 400 | Bad Request | Validatsiya xatosi yoki noto'g'ri so'rov |
| 401 | Unauthorized | Autentifikatsiya talab qilinadi |
| 403 | Forbidden | Ruxsat yo'q (role yetarli emas) |
| 404 | Not Found | Resurs topilmadi |
| 409 | Conflict | Konflikt (masalan, email allaqachon mavjud) |
| 500 | Internal Server Error | Server xatosi |

---

## 🎯 NestJS Arxitektura

### Dependency Injection
NestJS IoC (Inversion of Control) container orqali barcha service va providerlarni avtomatik inject qiladi.

```typescript
constructor(
  private readonly authService: AuthService,
  private readonly configService: ConfigService,
) {}
```

### Modullar
Har bir feature alohida module sifatida:
- **AuthModule**: Autentifikatsiya va foydalanuvchilar
- **AnalysisModule**: Matn tahlili
- **ResultsModule**: Natijalarni boshqarish
- **AdminModule**: Admin panel
- **ModerationModule**: Moderatsiya tizimi

### Decoratorlar
TypeScript decorator'lari orqali routing, validation, authentication:

```typescript
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tizimga kirish' })
  async login(@Body() loginDto: LoginDto) {
    // ...
  }
}
```

### Guards
Route himoyasi:
- **JwtAuthGuard**: JWT token tekshirish
- **RolesGuard**: Rol asosida ruxsat

### Pipes
- **ValidationPipe**: Avtomatik validatsiya
- Global darajada qo'llanilgan

### Middleware
- **LoggerMiddleware**: Barcha HTTP so'rovlarni log qiladi

---

## 🔮 Keyingi bosqichlar

### Xavfsizlik
- [ ] Rate limiting (throttler)
- [ ] Helmet.js bilan security headers
- [ ] Request sanitization
- [ ] IP blacklisting

### Funksionallik
- [ ] Email verifikatsiyasi
- [ ] Parolni unutish/tiklash
- [ ] Refresh token mexanizmi
- [ ] User profilini tahrirlash
- [ ] File upload (avatar)
- [ ] Real-time notifications (WebSocket)

### Ma'lumotlar bazasi
- [ ] Redis caching
- [ ] Database migrations
- [ ] Backup mexanizmi

### Monitoring
- [ ] Winston/Pino logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Health check endpoints

### CI/CD
- [ ] GitHub Actions
- [ ] Automated testing
- [ ] Docker deployment
- [ ] Kubernetes orchestration

### Dokumentatsiya
- [ ] Postman collection
- [ ] API versioning
- [ ] Changelog

---

## 🤝 Hissa qo'shish

Pull request'lar xush kelibsiz! Katta o'zgarishlar uchun avval issue oching va muhokama qiling.

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Branch'ni push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

---

## 📖 Qo'shimcha resurslar

### NestJS
- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Courses](https://courses.nestjs.com)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### MongoDB
- [MongoDB Documentation](https://www.mongodb.com/docs)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

### OpenAI
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

### JWT
- [JWT.io](https://jwt.io)

---

## 👨‍💻 Muallif

**Sentinella Development Team**

---

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida.

---

## 🙏 Minnatdorchilik

- NestJS jamoasiga ajoyib framework uchun
- OpenAI texnologiyasi uchun
- Barcha ochiq manba kutubxonalar ishlab chiquvchilariga

---

**Made with ❤️ by Sentinella Team**
