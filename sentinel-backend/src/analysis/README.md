# Analysis Module - Sentinella Backend

Bu modul matnlarni toksiklik uchun tahlil qilish va natijalarni saqlash uchun mo'ljallangan.

## 📁 Struktura

```
src/analysis/
├── schemas/
│   └── analysis.schema.ts      # MongoDB schema
├── dto/
│   ├── create-analysis.dto.ts  # Tahlil qilish uchun DTO
│   └── query-analysis.dto.ts   # Tarix olish uchun DTO
├── interfaces/
│   └── analysis-response.interface.ts  # Response types
├── analysis.controller.ts      # API endpoints
├── analysis.service.ts         # Business logic
├── analysis.module.ts          # Module configuration
└── README.md
```

## 🚀 API Endpoints

### 1. POST /api/analysis/check
Matnni tahlil qilish va natijani saqlash

**Request:**
```json
{
  "text": "Tahlil qilinadigan matn",
  "userId": "507f1f77bcf86cd799439011" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli bajarildi",
  "data": {
    "id": "69c50af78c794de318d660d9",
    "originalText": "Tahlil qilinadigan matn",
    "toxicityLevel": "xavfsiz",
    "toxicityScore": 15.5,
    "detectedWords": [],
    "timestamp": "2026-03-26T10:31:19.110Z",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

### 2. GET /api/analysis/history
Foydalanuvchining tahlil tarixini olish

**Query Parameters:**
- `userId`: string (required via query param for now)
- `page`: number (default: 1)
- `pageSize`: number (default: 10, max: 100)
- `sortBy`: string (default: "createdAt")
- `sortOrder`: "asc" | "desc" (default: "desc")

**Response:**
```json
{
  "success": true,
  "message": "Tarix muvaffaqiyatli yuklandi",
  "data": {
    "results": [...],
    "total": 150,
    "page": 1,
    "pageSize": 10
  }
}
```

### 3. GET /api/analysis/:id
Tahlilni ID bo'yicha olish

**Response:**
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli topildi",
  "data": {
    "id": "69c50af78c794de318d660d9",
    "originalText": "...",
    "toxicityLevel": "shubhali",
    "toxicityScore": 52.8,
    "detectedWords": [...],
    "timestamp": "2026-03-26T10:31:19.110Z",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

### 4. DELETE /api/analysis/:id
Tahlilni o'chirish

**Response:**
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli o'chirildi"
}
```

## 🗄️ MongoDB Schema

```typescript
{
  originalText: string,           // Tahlil qilingan matn
  toxicityLevel: enum,            // "xavfsiz" | "shubhali" | "toksik"
  toxicityScore: number,          // 0-100
  detectedWords: DetectedWord[],  // Aniqlangan toksik so'zlar
  userId: ObjectId,               // User reference (optional)
  createdAt: Date,                // Avtomatik
  updatedAt: Date                 // Avtomatik
}
```

**DetectedWord Structure:**
```typescript
{
  word: string,      // So'z
  position: number,  // Matndagi pozitsiyasi
  severity: enum     // "low" | "medium" | "high"
}
```

## 🔍 Toxicity Level Qoidalari

```typescript
toxicityScore < 30  → "xavfsiz"
30 ≤ toxicityScore < 70 → "shubhali"
toxicityScore ≥ 70 → "toksik"
```

## 🧪 Test qilish

### cURL orqali:

**1. Matn tahlili:**
```bash
curl -X POST http://localhost:5001/api/analysis/check \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bu juda yaxshi fikr ekan",
    "userId": "507f1f77bcf86cd799439011"
  }'
```

**2. Tarixni olish:**
```bash
curl -X GET "http://localhost:5001/api/analysis/history?userId=507f1f77bcf86cd799439011&page=1&pageSize=10"
```

**3. ID bo'yicha olish:**
```bash
curl -X GET http://localhost:5001/api/analysis/69c50af78c794de318d660d9
```

**4. O'chirish:**
```bash
curl -X DELETE "http://localhost:5001/api/analysis/69c50af78c794de318d660d9?userId=507f1f77bcf86cd799439011"
```

## 📊 Toxicity Analysis Logic

Hozircha service oddiy mock logic ishlatadi:

```typescript
performToxicityAnalysis(text: string) {
  // Toksik so'zlar ro'yxati
  const toksikSozlar = ['yomon', 'ahmoq', 'jinni', 'bema\'ni', 'hech qachon'];

  // Har bir so'z uchun:
  // - high severity: +30 ball
  // - medium severity: +20 ball
  // - low severity: +10 ball

  // Qo'shimcha:
  // - "!" belgisi: +5 ball
  // - "???" belgisi: +10 ball

  // Maksimal: 100
}
```

### Kelajakda:
- [ ] AI model integratsiyasi (TensorFlow, Hugging Face, etc.)
- [ ] O'zbek tilidagi toksiklik detection modeli
- [ ] Real-time websocket tahlil
- [ ] Batch processing

## 🔐 Authentication

**Hozirgi holat:**
- JWT guard hali qo'shilmagan
- `userId` query parameter orqali yuboriladi

**Kelajakda:**
- JWT Bearer token orqali authentication
- `req.user.id` dan avtomatik foydalanish
- Role-based access control (RBAC)

## 🎯 Index lar

MongoDB performansini oshirish uchun quyidagi indexlar qo'shilgan:

```typescript
{ userId: 1, createdAt: -1 }  // User tarixini tezkor olish
{ toxicityLevel: 1 }          // Level bo'yicha filter
{ createdAt: -1 }             // Eng yangi tahlillar
```

## 📝 Swagger Documentation

API dokumentatsiyasi avtomatik generatsiya qilinadi:

```
http://localhost:5001/api-docs
```

Har bir endpoint uchun:
- Request/Response misollar
- Validation qoidalari
- Error responses
- Schema definitions

## 🛠️ Xatoliklarni Boshqarish

**Validation Errors (400):**
- Matn bo'sh: "Matn kiritilishi shart"
- Matn juda uzun: "Matn 5000 belgidan oshmasligi kerak"

**Not Found (404):**
- Tahlil topilmadi: "Tahlil topilmadi"

**Authorization Errors (403):**
- Huquq yo'q: "Sizda bu tahlilni o'chirish huquqi yo'q"

**Server Errors (500):**
- Database xatosi
- Kutilmagan xatoliklar

## 🔄 Frontend Integration

Frontend (React) uchun misol:

```typescript
import { analyzeText } from '@/pages/Check/_api';

const handleAnalyze = async () => {
  const response = await analyzeText({
    text: "Tahlil qilinadigan matn",
    userId: user?.id
  });

  console.log(response.data.toxicityScore); // 15.5
  console.log(response.data.toxicityLevel); // "xavfsiz"
};
```

## 👥 Author Information

**userId field:**
- MongoDB ObjectId formatida saqlanadi
- Optional field (mehmon foydalanuvchilar uchun)
- User collection ga reference
- Cascade delete qo'llab-quvvatlanmaydi (hozircha)

## 📚 Qo'shimcha Ma'lumot

- **Port:** 5001
- **Database:** MongoDB Atlas
- **ORM:** Mongoose
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI 3.0
