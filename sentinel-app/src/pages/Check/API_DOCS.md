# Check Page - API Documentation

Bu hujjat Check sahifasi uchun zarur bo'lgan barcha backend API endpoint larini batafsil tushuntiradi.

## Base URL
```
http://localhost:5001/api
```

Yoki environment variable orqali:
```bash
VITE_API_BASE_URL=http://your-backend-url.com/api
```

---

## 1. Matnni Tahlil Qilish (Analyze Text)

### Endpoint
```
POST /api/analysis/check
```

### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```
> **Eslatma:** Authorization header ixtiyoriy. Agar foydalanuvchi tizimga kirgan bo'lsa, token yuboriladi va tahlil foydalanuvchi tarixi bilan bog'lanadi.

### Request Body
```json
{
  "text": "Tahlil qilinadigan matn",
  "userId": "user-uuid-123"
}
```

**Parameters:**
- `text` (string, required): Tahlil qilinadigan matn (max: 5000 belgi)
- `userId` (string, optional): Foydalanuvchi ID si (agar tizimga kirgan bo'lsa)

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli bajarildi",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalText": "Bu juda yaxshi fikr ekan!",
    "toxicityLevel": "xavfsiz",
    "toxicityScore": 5.2,
    "detectedWords": [],
    "timestamp": "2024-03-26T10:30:00.000Z",
    "userId": "user-uuid-123"
  }
}
```

**Data Fields:**
- `id` (string): Tahlil ID si (UUID format)
- `originalText` (string): Tahlil qilingan matn
- `toxicityLevel` (string): Toksiklik darajasi - "xavfsiz", "shubhali", yoki "toksik"
- `toxicityScore` (number): Toksiklik ball (0-100)
- `detectedWords` (array): Aniqlangan toksik so'zlar ro'yxati
  - `word` (string): Toksik so'z
  - `position` (number): Matndagi pozitsiyasi
  - `severity` (string): Jiddiylik darajasi - "low", "medium", yoki "high"
- `timestamp` (string): Tahlil vaqti (ISO 8601 format)
- `userId` (string, optional): Foydalanuvchi ID si

### Toxicity Level Qoidalari
Backend quyidagi qoidalar asosida toxicityLevel ni belgilashi kerak:
- **xavfsiz**: toxicityScore < 30
- **shubhali**: 30 ≤ toxicityScore < 70
- **toksik**: toxicityScore ≥ 70

### Error Responses

**400 Bad Request** - Matn kiritilmagan
```json
{
  "success": false,
  "message": "Matn kiritilishi shart",
  "error": "INVALID_INPUT"
}
```

**400 Bad Request** - Matn juda uzun
```json
{
  "success": false,
  "message": "Matn 5000 belgidan oshmasligi kerak",
  "error": "TEXT_TOO_LONG"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Server xatosi yuz berdi",
  "error": "INTERNAL_ERROR"
}
```

---

## 2. Tahlil Tarixini Olish (Get Analysis History)

### Endpoint
```
GET /api/analysis/history
```

### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```
> **Muhim:** Bu endpoint faqat tizimga kirgan foydalanuvchilar uchun. Authorization header majburiy.

### Query Parameters
```
GET /api/analysis/history?page=1&pageSize=3&sortBy=analyzedAt&sortOrder=desc
```

**Parameters:**
- `page` (number, default: 1): Sahifa raqami
- `pageSize` (number, default: 10, max: 100): Har bir sahifadagi elementlar soni
- `sortBy` (string, default: "analyzedAt"): Qaysi maydon bo'yicha saralash
- `sortOrder` (string, default: "desc"): Saralash tartibi - "asc" yoki "desc"

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Tarix muvaffaqiyatli yuklandi",
  "data": {
    "results": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "text": "Bu juda yaxshi fikr ekan!",
        "toxicityLevel": "xavfsiz",
        "toxicityScore": 5.2,
        "analyzedAt": "2024-03-26T10:30:00.000Z",
        "detectedWords": []
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "text": "Nega har doim shunday qilasanlar?",
        "toxicityLevel": "shubhali",
        "toxicityScore": 52.8,
        "analyzedAt": "2024-03-25T15:20:00.000Z",
        "detectedWords": [
          {
            "word": "nega",
            "position": 0,
            "severity": "low"
          }
        ]
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 3
  }
}
```

**Data Fields:**
- `results` (array): Tahlil natijalari ro'yxati
  - `id` (string): Tahlil ID si
  - `text` (string): Tahlil qilingan matn
  - `toxicityLevel` (string): Toksiklik darajasi
  - `toxicityScore` (number): Toksiklik ball
  - `analyzedAt` (string): Tahlil vaqti
  - `detectedWords` (array): Aniqlangan so'zlar
- `total` (number): Jami tahlillar soni
- `page` (number): Joriy sahifa
- `pageSize` (number): Sahifadagi elementlar soni

### Error Responses

**401 Unauthorized** - Token yo'q yoki yaroqsiz
```json
{
  "success": false,
  "message": "Autentifikatsiya talab qilinadi",
  "error": "UNAUTHORIZED"
}
```

**404 Not Found** - Tarix topilmadi
```json
{
  "success": false,
  "message": "Tarix topilmadi",
  "error": "NOT_FOUND"
}
```

---

## 3. Tahlilni ID Bo'yicha Olish (Get Analysis by ID)

### Endpoint
```
GET /api/analysis/{analysisId}
```

### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```

### URL Parameters
- `analysisId` (string, required): Tahlil ID si (UUID format)

### Example Request
```
GET /api/analysis/550e8400-e29b-41d4-a716-446655440000
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli topildi",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "originalText": "Bu juda yomon fikr va sen buni hech qachon tushunmaysan!",
    "toxicityLevel": "toksik",
    "toxicityScore": 88.5,
    "detectedWords": [
      {
        "word": "yomon",
        "position": 8,
        "severity": "medium"
      },
      {
        "word": "hech qachon",
        "position": 35,
        "severity": "high"
      }
    ],
    "timestamp": "2024-03-26T10:30:00.000Z",
    "userId": "user-uuid-123"
  }
}
```

### Error Responses

**400 Bad Request** - Noto'g'ri ID formati
```json
{
  "success": false,
  "message": "Noto'g'ri ID formati",
  "error": "INVALID_ID"
}
```

**404 Not Found** - Tahlil topilmadi
```json
{
  "success": false,
  "message": "Tahlil topilmadi",
  "error": "NOT_FOUND"
}
```

---

## 4. Tahlilni O'chirish (Delete Analysis)

### Endpoint
```
DELETE /api/analysis/{analysisId}
```

### Request Headers
```json
{
  "Authorization": "Bearer <token>"
}
```
> **Muhim:** Foydalanuvchi faqat o'z tahlillarini o'chirishi mumkin.

### URL Parameters
- `analysisId` (string, required): O'chiriladigan tahlil ID si (UUID format)

### Example Request
```
DELETE /api/analysis/550e8400-e29b-41d4-a716-446655440000
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "message": "Tahlil muvaffaqiyatli o'chirildi"
}
```

### Error Responses

**401 Unauthorized** - Token yo'q
```json
{
  "success": false,
  "message": "Autentifikatsiya talab qilinadi",
  "error": "UNAUTHORIZED"
}
```

**403 Forbidden** - Bu tahlil foydalanuvchiga tegishli emas
```json
{
  "success": false,
  "message": "Sizda bu tahlilni o'chirish huquqi yo'q",
  "error": "FORBIDDEN"
}
```

**404 Not Found** - Tahlil topilmadi
```json
{
  "success": false,
  "message": "Tahlil topilmadi",
  "error": "NOT_FOUND"
}
```

---

## Frontend Implementation Details

### 1. Token Management
Token `localStorage` da `'token'` kaliti bilan saqlanadi:
```javascript
localStorage.setItem('token', yourToken);
```

### 2. Axios Interceptor
`src/utils/axios.ts` faylidagi interceptor avtomatik ravishda har bir so'rovga Authorization header qo'shadi:
```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Error Handling
Barcha API funksiyalarda xatolar tutiladi va foydalanuvchiga tushunarli xabar ko'rsatiladi:
```javascript
try {
  const response = await analyzeText({ text });
} catch (error) {
  setError(error.message); // "Tahlil qilishda xatolik yuz berdi"
}
```

---

## Database Schema Tavsiyalari

### Analysis Table
```sql
CREATE TABLE analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text TEXT NOT NULL,
  toxicity_level VARCHAR(20) NOT NULL CHECK (toxicity_level IN ('xavfsiz', 'shubhali', 'toksik')),
  toxicity_score DECIMAL(5,2) NOT NULL CHECK (toxicity_score >= 0 AND toxicity_score <= 100),
  detected_words JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analysis_user_id ON analysis(user_id);
CREATE INDEX idx_analysis_timestamp ON analysis(timestamp DESC);
```

### Detected Words JSON Structure
```json
[
  {
    "word": "toksik so'z",
    "position": 10,
    "severity": "high"
  }
]
```

---

## Testing Endpoints

### cURL Examples

**1. Tahlil qilish (Analyze Text)**
```bash
curl -X POST http://localhost:5001/api/analysis/check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "Bu test matni",
    "userId": "user-123"
  }'
```

**2. Tarixni olish (Get History)**
```bash
curl -X GET "http://localhost:5001/api/analysis/history?page=1&pageSize=3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Bitta tahlilni olish (Get by ID)**
```bash
curl -X GET http://localhost:5001/api/analysis/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. O'chirish (Delete)**
```bash
curl -X DELETE http://localhost:5001/api/analysis/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Integration

Check sahifasida quyidagi funksiyalar ishlatiladi:

```typescript
// 1. Matn tahlili
const handleAnalyze = async () => {
  const response = await analyzeText({ text });
  setResult(response.data);
};

// 2. Tarixni yuklash
useEffect(() => {
  const fetchHistory = async () => {
    const response = await getUserAnalysisHistory({
      page: 1,
      pageSize: 3,
      sortBy: 'analyzedAt',
      sortOrder: 'desc'
    });
    setHistory(response.data.results);
  };
  fetchHistory();
}, []);
```

---

## Notes for Backend Developers

1. **UUID Format**: Barcha ID lar UUID v4 formatida bo'lishi kerak
2. **Timestamp Format**: ISO 8601 formatida qaytaring (masalan: `2024-03-26T10:30:00.000Z`)
3. **CORS**: Frontend `localhost:5173` dan so'rov yuboradi, CORS ni sozlang
4. **Rate Limiting**: Tahlil endpoint ga rate limiting qo'shing (masalan: 10 so'rov/minut)
5. **Input Validation**: Matn uzunligini tekshiring (max 5000 belgi)
6. **Authorization**: `/analysis/history` va `/analysis/:id/delete` endpoint lari autentifikatsiya talab qiladi
7. **User Association**: Agar token yuborilsa, tahlilni foydalanuvchi bilan bog'lang

---

## Qo'shimcha Dokumentatsiya

- TypeScript types: `src/types/api.ts`
- API Client: `src/utils/axios.ts`
- API Functions: `src/pages/Check/_api.ts`
- Check Page: `src/pages/Check/Check.tsx`
