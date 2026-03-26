# Sentinel Backend API (NestJS + TypeScript)

Sentinel ilovasi uchun TypeScript va NestJS frameworki bilan yozilgan backend API servisi.

## 🚀 Texnologiyalar

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Swagger** - API dokumentatsiyasi
- **JWT** - Authentication
- **Passport** - Authentication middleware
- **bcrypt** - Parolni hashlash
- **class-validator & class-transformer** - Ma'lumotlarni validatsiya qilish

## 📁 Loyiha strukturasi

```
Sentinel-backend/
├── src/
│   ├── auth/                      # Authentication moduli
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── register.dto.ts    # Register uchun DTO
│   │   │   └── login.dto.ts       # Login uchun DTO
│   │   ├── entities/              # Entity'lar
│   │   │   └── user.entity.ts     # User entity
│   │   ├── guards/                # Auth guards
│   │   │   └── jwt-auth.guard.ts  # JWT guard
│   │   ├── strategies/            # Passport strategies
│   │   │   └── jwt.strategy.ts    # JWT strategy
│   │   ├── auth.controller.ts     # Auth controller (endpoints)
│   │   ├── auth.service.ts        # Auth business logic
│   │   ├── auth.module.ts         # Auth module
│   │   └── users.service.ts       # Users service
│   ├── common/                    # Umumiy fayllar
│   │   └── middleware/
│   │       └── logger.middleware.ts  # HTTP request logger
│   ├── app.controller.ts          # Asosiy controller
│   ├── app.module.ts              # Root module
│   ├── app.service.ts             # Asosiy service
│   └── main.ts                    # Entry point
├── .env                           # Environment o'zgaruvchilar
├── .env.example                   # Environment namunasi
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript konfiguratsiya
```

## 📦 O'rnatish

1. Dependencylarni o'rnatish:
```bash
npm install
```

2. `.env` faylini sozlash:
```bash
cp .env.example .env
```

`.env` faylida quyidagi o'zgaruvchilarni sozlang:
```
PORT=5001
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🏃 Serverni ishga tushirish

### Development rejimda (hot reload bilan):
```bash
npm run start:dev
```

### Production rejimda:
```bash
npm run build
npm run start:prod
```

### Debug rejimda:
```bash
npm run start:debug
```

Server `http://localhost:5001` manzilida ishga tushadi.

## 📚 API Dokumentatsiyasi

Swagger dokumentatsiyasi quyidagi manzilda mavjud:
```
http://localhost:5001/api-docs
```

API prefix: `/api`

## 🔌 API Endpointlar

### Authentication

#### 1. Ro'yxatdan o'tish (Register)
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Shamshod",
  "email": "shamshod@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890_abcdefg",
    "name": "Shamshod",
    "email": "shamshod@example.com",
    "createdAt": "2026-03-26T08:00:00.000Z"
  }
}
```

#### 2. Tizimga kirish (Login)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "shamshod@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890_abcdefg",
    "name": "Shamshod",
    "email": "shamshod@example.com",
    "createdAt": "2026-03-26T08:00:00.000Z"
  }
}
```

## ✅ Validatsiya qoidalari

### Register
- `name`: Majburiy, kamida 2 ta belgi
- `email`: Majburiy, to'g'ri email formati
- `password`: Majburiy, kamida 6 ta belgi

### Login
- `email`: Majburiy, to'g'ri email formati
- `password`: Majburiy

## 📝 API Request Logging

Barcha HTTP requestlar terminalda quyidagi formatda ko'rinadi:

```
[HTTP] POST /api/auth/register 201 77ms - curl/8.7.1 ::1
[HTTP] POST /api/auth/login 200 70ms - curl/8.7.1 ::1
```

Format: `METHOD URL STATUS_CODE RESPONSE_TIME - USER_AGENT IP`

## ⚠️ Xatolik kodlari

- `200` - OK
- `201` - Created
- `400` - Bad Request (validatsiya xatosi)
- `401` - Unauthorized (autentifikatsiya xatosi)
- `404` - Not Found
- `409` - Conflict (email allaqachon mavjud)
- `500` - Internal Server Error

## 💾 Ma'lumotlar bazasi

Hozircha ma'lumotlar xotirada (in-memory) saqlanmoqda. Keyinchalik MongoDB, PostgreSQL yoki boshqa database bilan almashtiriladi.

## 🔒 Xavfsizlik

- Parollar `bcrypt` yordamida hash qilinadi (10 rounds)
- JWT tokenlar autentifikatsiya uchun ishlatiladi
- CORS yoqilgan
- Input validatsiya qo'llaniladi (class-validator)
- Whitelist va transform yoqilgan

## 🧪 Test qilish

### cURL bilan:

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "test123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'

# Validation xatolarini test qilish
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "A", "email": "invalid", "password": "123"}'
```

### Postman yoki Insomnia bilan:

Swagger UI dan export qilib import qilishingiz mumkin.

## 🛠️ Scripts

```bash
npm run start          # Serverni ishga tushirish
npm run start:dev      # Development rejimda (watch mode)
npm run start:debug    # Debug rejimda
npm run start:prod     # Production rejimda
npm run build          # Production build
npm run format         # Code formatlash (Prettier)
npm run lint           # Linting (ESLint)
npm run test           # Unit testlar
npm run test:e2e       # E2E testlar
npm run test:cov       # Test coverage
```

## 🎯 NestJS Xususiyatlari

### Dependency Injection
NestJS IoC container orqali barcha service va providerlarni avtomatik inject qiladi.

### Modullar
Kodlar module'larga ajratilgan - har bir feature alohida module sifatida.

### Decoratorlar
TypeScript decorator'lari orqali routing, validation, authentication sozlanadi.

### Middleware
Logger middleware barcha route'larga qo'llaniladi va requestlarni log qiladi.

### Guards
JWT guard protected route'lar uchun ishlatiladi (hozircha implemented emas).

### Pipes
ValidationPipe global darajada qo'llanilgan - barcha input'lar avtomatik validate qilinadi.

## 🔮 Keyingi bosqichlar

- [ ] Ma'lumotlar bazasini ulash (MongoDB/PostgreSQL/TypeORM/Prisma)
- [ ] User profilini tahrirlash API
- [ ] Parolni unutish/tiklash funksiyasi
- [ ] Email verifikatsiyasi
- [ ] Refresh token mexanizmi
- [ ] Rate limiting (throttler)
- [ ] Protected route'lar (JWT guard)
- [ ] Role-based access control (RBAC)
- [ ] Logging sistema (Winston/Pino)
- [ ] Unit va E2E testlar
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📖 Qo'shimcha ma'lumot

### NestJS Documentation
https://docs.nestjs.com

### TypeScript Documentation
https://www.typescriptlang.org/docs

### Swagger Documentation
https://swagger.io/docs

## 👨‍💻 Muallif

Sentinel Development Team

## 📄 Litsenziya

MIT
