# SENTINELLA - TEXNIK STEK VA KOMPONENTLAR

**Loyiha nomi:** Sentinella - Matn Toksiklik Tahlil Tizimi
**Versiya:** 1.0.0
**Sana:** 2026-04-16

---

## 📋 MUNDARIJA

1. [Backend](#1-backend)
2. [Frontend](#2-frontend)
3. [Preprocessing](#3-preprocessing)
4. [Model](#4-model)
5. [Ma'lumotlar Bazasi](#5-malumotlar-bazasi)
6. [Tashqi Servislar](#6-tashqi-servislar)
7. [Xavfsizlik](#7-xavfsizlik)
8. [Development Tools](#8-development-tools)

---

## 1. BACKEND

### 1.1. Framework va Runtime

**NestJS 10.x + Node.js**
- **Framework**: NestJS 10.0.0
- **Runtime**: Node.js (LTS)
- **Til**: TypeScript 5.1.3
- **Arxitektura**: Modular (Dependency Injection)

### 1.2. Asosiy Kutubxonalar

#### 1.2.1. Core Dependencies

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0"
}
```

**Vazifasi:**
- HTTP server (Express)
- Dependency Injection container
- Module system
- Decorators va metadata

#### 1.2.2. API va Dokumentatsiya

```json
{
  "@nestjs/swagger": "^11.2.6",
  "swagger-ui-express": "^5.0.1"
}
```

**Endpoint:** `http://localhost:5001/api-docs`

**Imkoniyatlari:**
- Avtomatik API dokumentatsiya
- Interactive API testing
- OpenAPI 3.0 specification

#### 1.2.3. Ma'lumotlar Bazasi

```json
{
  "@nestjs/mongoose": "^11.0.4",
  "mongoose": "^8.23.0"
}
```

**Vazifasi:**
- MongoDB bilan ODM (Object Data Modeling)
- Schema validation
- Query builder
- Populate va aggregation

### 1.3. Autentifikatsiya va Xavfsizlik

```json
{
  "@nestjs/passport": "^11.0.5",
  "@nestjs/jwt": "^11.0.2",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "bcrypt": "^6.0.0"
}
```

**Autentifikatsiya oqimi:**
1. **Login** → Email + Password
2. **Validation** → Bcrypt.compare()
3. **Token Generation** → JWT.sign()
4. **Response** → Token + User data

**Xavfsizlik mexanizmlari:**
- Password hashing (Bcrypt, 10 rounds)
- JWT token (7 kun muddati)
- Role-based access control (RBAC)
- Guards va Strategies

### 1.4. Validatsiya

```json
{
  "class-validator": "^0.15.1",
  "class-transformer": "^0.5.1"
}
```

**Misol - DTO Validation:**
```typescript
export class CreateAnalysisDto {
  @IsString()
  @IsNotEmpty({ message: 'Matn kiritilishi shart' })
  @MaxLength(5000, { message: 'Matn 5000 belgidan oshmasligi kerak' })
  text: string;
}
```

### 1.5. Konfiguratsiya

```json
{
  "@nestjs/config": "^4.0.3"
}
```

**Environment Variables (.env):**
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/sentinella
JWT_SECRET=super_secret_key
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-proj-xxxxx
```

### 1.6. API Endpoints

| Endpoint | Metod | Tavsiflash | Auth |
|----------|-------|------------|------|
| `/api/auth/register` | POST | Ro'yxatdan o'tish | ❌ |
| `/api/auth/login` | POST | Tizimga kirish | ❌ |
| `/api/analysis/check` | POST | Matn tahlil qilish | ✅ JWT |
| `/api/analysis/history` | GET | Tahlil tarixi | ✅ JWT |
| `/api/results` | GET | Natijalar ro'yxati | ✅ JWT |
| `/api/admin/dashboard` | GET | Admin dashboard | ✅ JWT + Admin |
| `/api/moderation` | GET | Moderatsiya | ✅ JWT + Moderator |

### 1.7. Server Konfiguratsiyasi

**main.ts:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Port
  await app.listen(5001);
}
```

---

## 2. FRONTEND

### 2.1. Framework va Build Tool

**React 18.2 + Vite**
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.10
- **Til**: TypeScript 5.3.3
- **Arxitektura**: Component-based SPA

### 2.2. Asosiy Kutubxonalar

#### 2.2.1. Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

**Vazifasi:**
- Virtual DOM
- Component lifecycle
- Hooks (useState, useEffect, etc.)
- JSX sintaksis

#### 2.2.2. Routing

```json
{
  "react-router-dom": "^6.21.1"
}
```

**Routes:**
```typescript
<Routes>
  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected */}
  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
  <Route path="/check" element={<ProtectedRoute><Check /></ProtectedRoute>} />

  {/* Admin */}
  <Route path="/admin" element={
    <ProtectedRoute requiredRole="admin">
      <Admin />
    </ProtectedRoute>
  } />
</Routes>
```

#### 2.2.3. HTTP Client

```json
{
  "axios": "^1.6.5"
}
```

**Konfiguratsiya:**
```typescript
const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor - Token qo'shish
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Xatolarni boshqarish
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 2.2.4. Vizualizatsiya

```json
{
  "recharts": "^3.8.1"
}
```

**Imkoniyatlari:**
- Line charts
- Bar charts
- Pie charts
- Area charts
- Responsive design

### 2.3. Loyiha Strukturasi

```
sentinel-app/
├── src/
│   ├── App.tsx                  # Root component, routing
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles
│   │
│   ├── components/              # Reusable components
│   │   ├── MainLayout.tsx       # Page layout
│   │   ├── TopAppBar.tsx        # Navigation bar
│   │   ├── BottomNavBar.tsx     # Mobile nav
│   │   ├── Footer.tsx           # Footer
│   │   └── Modal.tsx            # Modal dialog
│   │
│   ├── pages/                   # Page components
│   │   ├── Login/
│   │   │   ├── Login.tsx        # Login UI
│   │   │   └── _api.ts          # Login API
│   │   ├── Register/
│   │   │   ├── Register.tsx
│   │   │   └── _api.ts
│   │   ├── Home/
│   │   │   └── Home.tsx         # Dashboard
│   │   ├── Check/
│   │   │   ├── Check.tsx        # Text analysis UI
│   │   │   └── _api.ts
│   │   ├── Results/
│   │   │   ├── Results.tsx
│   │   │   └── _api.ts
│   │   └── Admin/
│   │       ├── Admin.tsx
│   │       └── _api.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── api.ts               # API response types
│   │
│   └── utils/                   # Utility functions
│       └── axios.ts             # HTTP client config
│
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 2.4. State Management

**Local State (useState):**
```typescript
const [text, setText] = useState('');
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState('');
```

**Persistent Storage (localStorage):**
```typescript
// Save
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Read
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Remove
localStorage.removeItem('token');
```

### 2.5. Development Tools

```json
{
  "@vitejs/plugin-react": "^4.2.1",
  "eslint": "^8.56.0",
  "typescript": "^5.3.3"
}
```

**Dev Server:**
```bash
npm run dev
# Server: http://localhost:5173
```

**Build:**
```bash
npm run build
# Output: dist/
```

---

## 3. PREPROCESSING

### 3.1. Input Qabul Qilish

#### 3.1.1. Frontend Validation

**Check.tsx (Lines 72-76):**
```typescript
const handleAnalyze = async () => {
  if (!text.trim()) {
    setError('Iltimos, tahlil qilish uchun matn kiriting');
    return;
  }

  // Character limit check
  if (text.length > 5000) {
    setError('Matn 5000 belgidan oshmasligi kerak');
    return;
  }

  // API call...
};
```

**Real-time counter:**
```typescript
<span>{text.length} / 5000 belgilar</span>
```

#### 3.1.2. Backend Validation (DTO)

**create-analysis.dto.ts:**
```typescript
export class CreateAnalysisDto {
  @IsString()
  @IsNotEmpty({ message: 'Matn kiritilishi shart' })
  @MaxLength(5000, { message: 'Matn 5000 belgidan oshmasligi kerak' })
  text: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
```

**Validation Pipe (main.ts):**
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Faqat DTO fieldlar
    forbidNonWhitelisted: true,   // Extra fieldlarni rad qilish
    transform: true,              // Auto type conversion
  })
);
```

### 3.2. Matn Normalizatsiyasi

**Kichik harflarga aylantirish:**
```typescript
const lowerText = text.toLowerCase();
```

**Maqsad:**
- Case-insensitive pattern matching
- Uniform comparison

### 3.3. Tokenizatsiya va Pattern Matching

#### 3.3.1. Regex-based Tahdid Aniqlash

**analysis.service.ts (Lines 187-248):**
```typescript
const threatPatterns = [
  {
    pattern: /qidirib\s*topaman/gi,
    word: 'qidirib topaman',
    score: 90,
    severity: Severity.HIGH,
  },
  {
    pattern: /o\'ldiraman|o\'ldir(asiz|imiz)/gi,
    word: "o'ldiraman",
    score: 100,
    severity: Severity.HIGH,
  },
  {
    pattern: /tan(ib\s*)?ol(ma|may|asiz)/gi,
    word: "tan olmasang",
    score: 75,
    severity: Severity.MEDIUM,
  }
];

// Pattern matching
threatPatterns.forEach(({ pattern, word, score, severity }) => {
  const matches = text.match(pattern);
  if (matches) {
    matches.forEach((match) => {
      const index = text.toLowerCase().indexOf(match.toLowerCase());
      detectedWords.push({
        word: match,
        position: index,
        severity,
      });
      toxicityScore += score;
      threatScore += score;
    });
  }
});
```

#### 3.3.2. Dictionary-based Haqorat Aniqlash

**analysis.service.ts (Lines 251-273):**
```typescript
const insultWords = [
  { word: 'ahmoq', score: 60, severity: Severity.HIGH },
  { word: 'tentak', score: 65, severity: Severity.HIGH },
  { word: 'hayvon', score: 70, severity: Severity.HIGH },
  { word: 'jinni', score: 55, severity: Severity.MEDIUM },
  { word: 'bema\'ni', score: 40, severity: Severity.MEDIUM }
];

insultWords.forEach(({ word, score, severity }) => {
  const index = lowerText.indexOf(word);
  if (index !== -1) {
    detectedWords.push({
      word,
      position: index,
      severity,
    });
    toxicityScore += score;
    offenseScore += score;
  }
});
```

### 3.4. Kontekstual Tahlil

#### 3.4.1. Undov Belgilari

```typescript
const exclamationCount = (text.match(/!/g) || []).length;
if (exclamationCount > 2) {
  const aggressionBonus = exclamationCount * 3;
  toxicityScore += aggressionBonus;
  aggressionScore += aggressionBonus;
}
```

#### 3.4.2. CAPS LOCK (Baqirish)

```typescript
const upperCaseRatio = (text.match(/[A-ZА-ЯЎҒҚҲЎʻ]/g) || []).length / text.length;
if (upperCaseRatio > 0.5 && text.length > 10) {
  toxicityScore += 20;
  aggressionScore += 25;
}
```

#### 3.4.3. Ko'p Undov Ketma-ketligi

```typescript
if (/!{3,}/.test(text)) {
  toxicityScore += 15;
  aggressionScore += 20;
}
```

### 3.5. Score Normalizatsiyasi

**0-100 oraliqqa keltirish:**
```typescript
toxicityScore = Math.min(Math.round(toxicityScore), 100);
aggressionScore = Math.min(Math.round(aggressionScore), 100);
offenseScore = Math.min(Math.round(offenseScore), 100);
threatScore = Math.min(Math.round(threatScore), 100);
```

### 3.6. Toxicity Level Aniqlash

```typescript
let toxicityLevel: ToxicityLevel;
if (toxicityScore < 30) {
  toxicityLevel = ToxicityLevel.XAVFSIZ;
} else if (toxicityScore < 70) {
  toxicityLevel = ToxicityLevel.SHUBHALI;
} else {
  toxicityLevel = ToxicityLevel.TOKSIK;
}
```

**Kategoriyalar:**
- **XAVFSIZ**: 0-29 ball (yashil)
- **SHUBHALI**: 30-69 ball (sariq)
- **TOKSIK**: 70-100 ball (qizil)

---

## 4. MODEL

### 4.1. AI Model - GPT-4o-mini (OpenAI)

**Kutubxona:**
```json
{
  "openai": "^6.33.0"
}
```

**Model:** `gpt-4o-mini`

### 4.2. Model Xususiyatlari

| Parametr | Qiymat | Tavsiflash |
|----------|--------|------------|
| **Model** | gpt-4o-mini | Tez va arzon GPT variant |
| **Temperature** | 0.3 | Past = aniqroq, deterministik |
| **Max Tokens** | 500 | Maksimal javob uzunligi |
| **Response Format** | json_object | Strukturali JSON javob |

### 4.3. Prompt Engineering

**openai.service.ts (Lines 42-69):**
```typescript
const prompt = `Sen o'zbek tilida yozilgan matnlarning toksiklik darajasini aniqlaydigan AI assistantsan.

Quyidagi matnni tahlil qil va JSON formatida javob ber:

Matn: "${text}"

Tahlil mezonlari:
1. toxicityScore (0-100): Umumiy toksiklik darajasi
2. aggressionScore (0-100): Tajovuz va agressivlik darajasi
3. offenseScore (0-100): Haqorat va kamsitish darajasi
4. threatScore (0-100): Tahdid va qo'rqitish darajasi
5. detectedWords: Topilgan toksik so'zlar ro'yxati

Javobni faqat JSON formatida ber, boshqa hech narsa qo'shma:
{
  "toxicityScore": 0,
  "aggressionScore": 0,
  "offenseScore": 0,
  "threatScore": 0,
  "detectedWords": [
    {
      "word": "string",
      "position": 0,
      "severity": "low|medium|high"
    }
  ]
}`;
```

### 4.4. API Chaqiruv

**openai.service.ts (Lines 71-87):**
```typescript
async analyzeToxicity(text: string): Promise<ToxicityAnalysisResult> {
  const prompt = this.buildPrompt(text);

  const completion = await this.openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: "Sen o'zbek tilida matn toksikligini aniqlaydigan professional tahlilchisan. Faqat JSON formatida javob berasan.",
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const analysis = JSON.parse(completion.choices[0].message.content);
  return this.processAnalysis(analysis);
}
```

### 4.5. Hybrid Approach - AI + Pattern-based

**analysis.service.ts (Lines 46-57):**
```typescript
let analysisResult;
try {
  // 1. Primary: OpenAI AI tahlil
  this.logger.log('OpenAI yordamida tahlil qilinmoqda...');
  analysisResult = await this.openAIService.analyzeToxicity(text);
  this.logger.log('OpenAI tahlili muvaffaqiyatli bajarildi');
} catch (error) {
  // 2. Fallback: Pattern-based tahlil
  this.logger.warn(`OpenAI xatosi: ${error.message}. Pattern-based tahlilga o'tilmoqda...`);
  analysisResult = this.performToxicityAnalysis(text);
}
```

**Afzalliklari:**
- **Primary (AI)**: Yuqori aniqlik, semantic understanding
- **Fallback (Pattern-based)**: Ishonchlilik, offline ishlash

### 4.6. Model Response Processing

**openai.service.ts (Lines 98-129):**
```typescript
private processAnalysis(analysis: any): ToxicityAnalysisResult {
  // Score normalization
  const toxicityScore = Math.min(Math.max(analysis.toxicityScore || 0, 0), 100);
  const aggressionScore = Math.min(Math.max(analysis.aggressionScore || 0, 0), 100);
  const offenseScore = Math.min(Math.max(analysis.offenseScore || 0, 0), 100);
  const threatScore = Math.min(Math.max(analysis.threatScore || 0, 0), 100);

  // Detected words processing
  const detectedWords: DetectedWord[] = (analysis.detectedWords || []).map(
    (word: any) => ({
      word: word.word,
      position: word.position,
      severity: this.convertToSeverity(word.severity),
    }),
  );

  // Toxicity level determination
  let toxicityLevel: ToxicityLevel;
  if (toxicityScore < 30) {
    toxicityLevel = ToxicityLevel.XAVFSIZ;
  } else if (toxicityScore < 70) {
    toxicityLevel = ToxicityLevel.SHUBHALI;
  } else {
    toxicityLevel = ToxicityLevel.TOKSIK;
  }

  return {
    toxicityLevel,
    toxicityScore,
    aggressionScore,
    offenseScore,
    threatScore,
    detectedWords,
  };
}
```

### 4.7. Narxlar (GPT-4o-mini)

| Metrika | Narx |
|---------|------|
| **Input** | $0.15 / 1M tokens (~750K so'z) |
| **Output** | $0.60 / 1M tokens |

**Hisob-kitob:**
- 100 so'zlik matn ≈ 150 tokens
- 1000 tahlil ≈ 150,000 tokens
- 1000 tahlil narxi ≈ **$0.11** (input + output)

### 4.8. AI Afzalliklari

✅ **Yuqori aniqlik** - GPT modellari NLU da eng yaxshi
✅ **Multilingual** - O'zbek tilini yaxshi tushunadi
✅ **Semantic analysis** - Kontekstni tushunish
✅ **JSON output** - Strukturali javob
✅ **Fast** - GPT-4o-mini tez va arzon

---

## 5. MA'LUMOTLAR BAZASI

### 5.1. MongoDB

**Versiya:** 6.x+
**ODM:** Mongoose 8.23.0
**Turi:** NoSQL Document Database

### 5.2. Collections (Jadvallar)

#### 5.2.1. users

```typescript
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

#### 5.2.2. analyses

```typescript
{
  _id: ObjectId("660a5678901234abcdef5678"),
  originalText: "Tahlil qilingan matn",
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
  userId: ObjectId("660a1234567890abcdef1234"),
  createdAt: ISODate("2024-03-26T10:30:00Z"),
  updatedAt: ISODate("2024-03-26T10:30:00Z")
}
```

#### 5.2.3. moderations

```typescript
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

### 5.3. Schema Definition (Mongoose)

**user.schema.ts:**
```typescript
@Schema({ timestamps: true })
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
```

### 5.4. CRUD Operations

```typescript
// Create
const user = await this.userModel.create({ name, email, password });

// Read
const user = await this.userModel.findById(userId);
const users = await this.userModel.find({ role: 'user' });

// Update
await this.userModel.findByIdAndUpdate(userId, { name: "New Name" });

// Delete
await this.userModel.findByIdAndDelete(userId);
```

### 5.5. Connection

**.env:**
```env
# Local
MONGODB_URI=mongodb://localhost:27017/sentinella

# Cloud (Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sentinella
```

**app.module.ts:**
```typescript
MongooseModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
  inject: [ConfigService],
});
```

---

## 6. TASHQI SERVISLAR

### 6.1. OpenAI API

**URL:** `https://api.openai.com/v1/chat/completions`
**Auth:** Bearer token (API key)
**Model:** GPT-4o-mini

**Request:**
```typescript
{
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "System prompt" },
    { role: "user", content: "User prompt with text" }
  ],
  temperature: 0.3,
  max_tokens: 500,
  response_format: { type: "json_object" }
}
```

**Response:**
```typescript
{
  id: "chatcmpl-123",
  choices: [
    {
      message: {
        role: "assistant",
        content: "{\"toxicityScore\": 85, ...}"
      }
    }
  ],
  usage: {
    prompt_tokens: 150,
    completion_tokens: 120,
    total_tokens: 270
  }
}
```

---

## 7. XAVFSIZLIK

### 7.1. Password Security

**Bcrypt Hashing:**
```typescript
// Registration
const hashedPassword = await bcrypt.hash(password, 10);  // 10 rounds

// Login
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

### 7.2. JWT Authentication

**Token Generation:**
```typescript
const payload = { _id: user._id, email: user.email, role: user.role };
const token = this.jwtService.sign(payload, {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
});
```

**Token Structure:**
```
Header.Payload.Signature
eyJhbG...  .  eyJfaWQ...  .  SflKxw...
```

### 7.3. Guards

```typescript
@Get('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async getDashboard() {
  // Faqat admin kirishi mumkin
}
```

### 7.4. Input Validation

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
);
```

### 7.5. CORS

```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 8. DEVELOPMENT TOOLS

### 8.1. Backend Development

```json
{
  "@nestjs/cli": "^10.0.0",
  "prettier": "^3.0.0",
  "eslint": "^8.0.0",
  "jest": "^29.5.0",
  "ts-node": "^10.9.1"
}
```

**Scripts:**
```bash
npm run start:dev    # Development server with watch
npm run build        # Production build
npm run test         # Run tests
npm run lint         # ESLint
```

### 8.2. Frontend Development

```json
{
  "vite": "^5.0.10",
  "eslint": "^8.56.0",
  "typescript": "^5.3.3"
}
```

**Scripts:**
```bash
npm run dev          # Dev server (localhost:5173)
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

---

## 9. XULOSA

### 9.1. Texnologik Stack Summary

| Layer | Texnologiya | Versiya | Vazifa |
|-------|-------------|---------|--------|
| **Frontend** | React | 18.2.0 | UI Framework |
| | TypeScript | 5.3.3 | Type Safety |
| | Vite | 5.0.10 | Build Tool |
| | Axios | 1.6.5 | HTTP Client |
| | React Router | 6.21.1 | Routing |
| | Recharts | 3.8.1 | Charts |
| **Backend** | NestJS | 10.x | Framework |
| | TypeScript | 5.1.3 | Type Safety |
| | Mongoose | 8.23.0 | ODM |
| | Passport | 0.7.0 | Auth |
| | JWT | 11.0.2 | Tokens |
| | Bcrypt | 6.0.0 | Hashing |
| | OpenAI SDK | 6.33.0 | AI |
| | Swagger | 11.2.6 | Docs |
| **Database** | MongoDB | 6.x+ | NoSQL DB |
| **AI** | GPT-4o-mini | Latest | Text Analysis |

### 9.2. Arxitektura

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  React 18.2 + TypeScript + Vite + Axios            │
│  SPA, Component-based, Client-side routing          │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP/HTTPS (REST API)
                   │ JSON, JWT Auth
                   │
┌──────────────────▼──────────────────────────────────┐
│                    BACKEND                          │
│  NestJS 10.x + TypeScript + Mongoose               │
│  Modular, DI, Guards, Pipes, Interceptors          │
└─────┬──────────────────────┬────────────────────────┘
      │                      │
      ▼                      ▼
┌──────────────┐      ┌──────────────────┐
│   MongoDB    │      │   OpenAI API     │
│   Database   │      │   GPT-4o-mini    │
└──────────────┘      └──────────────────┘
```

### 9.3. Asosiy Xususiyatlar

✅ **Hybrid AI Model** - GPT-4o-mini + Pattern-based fallback
✅ **Secure Authentication** - JWT + Bcrypt + RBAC
✅ **Type-Safe** - Full TypeScript stack
✅ **Modular Architecture** - NestJS DI + React Components
✅ **Real-time Validation** - Frontend + Backend
✅ **Scalable Database** - MongoDB NoSQL
✅ **Auto Documentation** - Swagger UI
✅ **Contextual Analysis** - Punctuation, CAPS, patterns
✅ **O'zbek tili** - Optimized for Uzbek language

---

**Muallif:** Sentinella Development Team
**Sana:** 2026-04-16
**Versiya:** 1.0.0
