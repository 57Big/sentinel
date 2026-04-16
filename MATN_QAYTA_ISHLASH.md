# SENTINELLA TIZIMIDA MATNNI QAYTA ISHLASH JARAYONI (TEXT PREPROCESSING)

## 1. KIRISH

Sentinella loyihasi o'zbek tilida yozilgan matnlardagi toksiklik darajasini aniqlash uchun mo'ljallangan sun'iy intellektga asoslangan tizimdir. Matnlarni qayta ishlash jarayoni bir necha bosqichdan iborat bo'lib, har bir bosqichda ma'lum bir vazifa bajariladi. Ushbu hujjatda matnni qabul qilish, tozalash, tokenizatsiya, normalizatsiya va modelga tayyorlash jarayonlari tahlil qilinadi.

## 2. MATN QABUL QILISH (INPUT RECEPTION)

### 2.1. Frontend qatlamida qabul qilish

Foydalanuvchi matnni frontend interfeysi orqali kiritadi (`sentinel-app/src/pages/Check/Check.tsx:9`). Matn `useState` hook yordamida boshqariladi:

```typescript
const [text, setText] = useState('');
```

Foydalanuvchi matnni `textarea` elementiga kiritadi va `onChange` hodisasi orqali holat yangilanadi (`Check.tsx:139`):

```typescript
<textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  disabled={loading}
/>
```

### 2.2. API qatlamida qabul qilish

Matn HTTP POST so'rovi orqali backend API ga yuboriladi (`sentinel-app/src/pages/Check/_api.ts:94-108`):

```typescript
export const analyzeText = async (
  analysisData: ToxicityAnalysisRequest
): Promise<ToxicityAnalysisResponse> => {
  const response = await apiClient.post<ToxicityAnalysisResponse>(
    '/analysis/check',
    analysisData
  );
  return response.data;
};
```

So'rov JSON formatida quyidagi strukturaga ega:

```json
{
  "text": "Tahlil qilinadigan matn"
}
```

### 2.3. Backend Controller qatlamida qabul qilish

Backend tomonda `AnalysisController` (`sentinel-backend/src/analysis/analysis.controller.ts:78-95`) so'rovni qabul qiladi:

```typescript
async analyzeText(
  @Body() createAnalysisDto: CreateAnalysisDto,
  @Request() req,
) {
  const userId = req.user._id.toString();
  const data = await this.analysisService.analyzeText({
    ...createAnalysisDto,
    userId,
  });
}
```

## 3. VALIDATSIYA VA TOZALASH (VALIDATION & CLEANING)

### 3.1. Frontend validatsiyasi

Frontend qatlamida asosiy validatsiya amalga oshiriladi (`Check.tsx:72-76`):

```typescript
const handleAnalyze = async () => {
  if (!text.trim()) {
    setError('Iltimos, tahlil qilish uchun matn kiriting');
    return;
  }
  // ...
};
```

Shuningdek, matn uzunligi real-time ravishda kuzatiladi (`Check.tsx:130`):

```typescript
<span className="text-xs font-label font-medium">
  {text.length} / 5000 belgilar
</span>
```

### 3.2. Backend validatsiyasi

Backend qatlamida `CreateAnalysisDto` (`sentinel-backend/src/analysis/dto/create-analysis.dto.ts:4-22`) orqali qat'iy validatsiya qo'llaniladi:

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

Validatsiya qoidalari:
- **@IsString()**: Matn string tipida bo'lishi kerak
- **@IsNotEmpty()**: Matn bo'sh bo'lmasligi kerak
- **@MaxLength(5000)**: Maksimal uzunlik 5000 belgi

### 3.3. Tozalash jarayoni

Tizimda explicit tozalash funksiyasi mavjud emas, lekin tahlil jarayonida matn `toLowerCase()` orqali kichik harflarga o'tkaziladi (`analysis.service.ts:179`):

```typescript
const lowerText = text.toLowerCase();
```

Bu case-insensitive pattern matching uchun zarur.

## 4. TOKENIZATSIYA (TOKENIZATION)

### 4.1. Pattern-based tokenizatsiya

Tizimda traditional tokenizatsiya mavjud emas, balki regex-based pattern matching qo'llaniladi. Bu yondashuv toksik so'zlar va iboralarni aniqlash uchun ishlatiladi.

#### 4.1.1. Tahdid iboralarini aniqlash

Regex patternlar yordamida tahdid iboralar aniqlanadi (`analysis.service.ts:187-248`):

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
  // ...
];
```

Pattern matching jarayoni (`analysis.service.ts:294-308`):

```typescript
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

#### 4.1.2. Haqorat so'zlarini aniqlash

Dictionary-based yondashuv qo'llaniladi (`analysis.service.ts:251-273`):

```typescript
const insultWords = [
  { word: 'ahmoq', score: 60, severity: Severity.HIGH },
  { word: 'tentak', score: 65, severity: Severity.HIGH },
  { word: 'hayvon', score: 70, severity: Severity.HIGH },
  // ...
];
```

So'z qidiruv jarayoni (`analysis.service.ts:311-322`):

```typescript
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

### 4.2. AI-based tokenizatsiya (GPT-4o-mini)

OpenAI GPT-4o-mini modeli orqali ilg'or tokenizatsiya amalga oshiriladi (`openai.service.ts:71-87`):

```typescript
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
```

AI modelga beriladigan prompt (`openai.service.ts:42-69`):

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
  "detectedWords": [...]
}`;
```

## 5. NORMALIZATSIYA (NORMALIZATION)

### 5.1. Score normalizatsiyasi

Barcha scorlar 0-100 oralig'ida normalizatsiya qilinadi (`analysis.service.ts:98-110`, `openai.service.ts:98-110`):

```typescript
const toxicityScore = Math.min(Math.max(analysis.toxicityScore || 0, 0), 100);
const aggressionScore = Math.min(Math.max(analysis.aggressionScore || 0, 0), 100);
const offenseScore = Math.min(Math.max(analysis.offenseScore || 0, 0), 100);
const threatScore = Math.min(Math.max(analysis.threatScore || 0, 0), 100);
```

Pattern-based tahlilda ham xuddi shunday normalizatsiya amalga oshiriladi (`analysis.service.ts:384-387`):

```typescript
toxicityScore = Math.min(Math.round(toxicityScore), 100);
aggressionScore = Math.min(Math.round(aggressionScore), 100);
offenseScore = Math.min(Math.round(offenseScore), 100);
threatScore = Math.min(Math.round(threatScore), 100);
```

### 5.2. Severity normalizatsiyasi

Severity string qiymatlarini enum ga o'zgartirish (`openai.service.ts:113-119`):

```typescript
const detectedWords: DetectedWord[] = (analysis.detectedWords || []).map(
  (word: any) => ({
    word: word.word,
    position: word.position,
    severity: this.convertToSeverity(word.severity),
  }),
);
```

Severity converter funksiyasi (`openai.service.ts:150-161`):

```typescript
private convertToSeverity(severity: string): Severity {
  switch (severity?.toLowerCase()) {
    case 'high':
      return Severity.HIGH;
    case 'medium':
      return Severity.MEDIUM;
    case 'low':
      return Severity.LOW;
    default:
      return Severity.LOW;
  }
}
```

### 5.3. Toxicity Level normalizatsiyasi

Score qiymatiga asoslangan holda toxicity level aniqlanadi (`openai.service.ts:122-129`, `analysis.service.ts:390-397`):

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

Normalizatsiya mezonlari:
- **XAVFSIZ**: 0-29 ball
- **SHUBHALI**: 30-69 ball
- **TOKSIK**: 70-100 ball

## 6. KONTEKSTUAL TAHLIL (CONTEXTUAL ANALYSIS)

### 6.1. Undov belgilari tahlili

Ko'p undov belgilar agressivlik belgisi sifatida qaraladi (`analysis.service.ts:354-359`):

```typescript
const exclamationCount = (text.match(/!/g) || []).length;
if (exclamationCount > 2) {
  const aggressionBonus = exclamationCount * 3;
  toxicityScore += aggressionBonus;
  aggressionScore += aggressionBonus;
}
```

### 6.2. CAPS LOCK tahlili

CAPS LOCK (baqirish) agressivlik belgisi (`analysis.service.ts:370-375`):

```typescript
const upperCaseRatio = (text.match(/[A-ZА-ЯЎҒҚҲЎʻ]/g) || []).length / text.length;
if (upperCaseRatio > 0.5 && text.length > 10) {
  toxicityScore += 20;
  aggressionScore += 25;
}
```

### 6.3. Ko'p undov belgilar ketma-ketligi

Uzun undov belgilar agressivlik belgisi (`analysis.service.ts:378-381`):

```typescript
if (/!{3,}/.test(text)) {
  toxicityScore += 15;
  aggressionScore += 20;
}
```

## 7. MODELGA TAYYORLASH (MODEL PREPARATION)

### 7.1. Hybrid Approach: AI + Pattern-based

Tizim ikki bosqichli yondashuvdan foydalanadi (`analysis.service.ts:46-57`):

```typescript
let analysisResult;
try {
  // 1. OpenAI yordamida tahlil (asosiy usul)
  this.logger.log('OpenAI yordamida tahlil qilinmoqda...');
  analysisResult = await this.openAIService.analyzeToxicity(text);
  this.logger.log('OpenAI tahlili muvaffaqiyatli bajarildi');
} catch (error) {
  // 2. Fallback: Pattern-based tahlil
  this.logger.warn(`OpenAI tahlil xatosi: ${error.message}. Pattern-based tahlilga o'tilmoqda...`);
  analysisResult = this.performToxicityAnalysis(text);
}
```

Bu yondashuv:
- **Primary**: GPT-4o-mini AI model (yuqori aniqlik)
- **Fallback**: Pattern-based tahlil (ishonchlilik)

### 7.2. Database modeliga tayyorlash

MongoDB schemasi orqali ma'lumotlar strukturasi belgilanadi (`analysis.schema.ts:28-78`):

```typescript
@Schema({ timestamps: true })
export class Analysis {
  @Prop({ required: true })
  originalText: string;

  @Prop({ type: String, enum: ToxicityLevel, required: true })
  toxicityLevel: ToxicityLevel;

  @Prop({ required: true, min: 0, max: 100 })
  toxicityScore: number;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  aggressionScore?: number;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  offenseScore?: number;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  threatScore?: number;

  @Prop({ type: [Object], default: [] })
  detectedWords: DetectedWord[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;
}
```

### 7.3. Ma'lumotlarni saqlash

Tahlil natijalari MongoDB ga saqlanadi (`analysis.service.ts:60-71`):

```typescript
const analysis = new this.analysisModel({
  originalText: text,
  toxicityLevel: analysisResult.toxicityLevel,
  toxicityScore: analysisResult.toxicityScore,
  aggressionScore: analysisResult.aggressionScore,
  offenseScore: analysisResult.offenseScore,
  threatScore: analysisResult.threatScore,
  detectedWords: analysisResult.detectedWords,
  userId: userId ? new Types.ObjectId(userId) : undefined,
});

const savedAnalysis = await analysis.save();
```

### 7.4. Moderatsiya tizimiga yuborish

Agar matn toksik yoki shubhali bo'lsa, avtomatik moderatsiya uchun yuboriladi (`analysis.service.ts:73-93`):

```typescript
if (
  (analysisResult.toxicityLevel === ToxicityLevel.TOKSIK ||
   analysisResult.toxicityLevel === ToxicityLevel.SHUBHALI) &&
  userId
) {
  try {
    await this.moderationService.createModerationItem({
      content: text,
      toxicityLevel: analysisResult.toxicityLevel,
      toxicityScore: analysisResult.toxicityScore,
      submittedBy: userId,
    });
    this.logger.log(`Moderatsiya elementi yaratildi: ${savedAnalysis._id}`);
  } catch (error) {
    this.logger.error(`Moderatsiya elementi yaratishda xatolik: ${error.message}`);
  }
}
```

## 8. RESPONSE FORMATLASH (RESPONSE FORMATTING)

### 8.1. Backend response

Backend response standart strukturada qaytariladi (`analysis.controller.ts:90-94`):

```typescript
return {
  success: true,
  message: 'Tahlil muvaffaqiyatli bajarildi',
  data,
};
```

### 8.2. Response format funksiyasi

`formatAnalysisResponse` funksiyasi natijalarni formatlaydi (`analysis.service.ts:412-425`):

```typescript
private formatAnalysisResponse(analysis: AnalysisDocument): AnalysisResponse {
  return {
    id: analysis._id.toString(),
    originalText: analysis.originalText,
    toxicityLevel: analysis.toxicityLevel,
    toxicityScore: analysis.toxicityScore,
    aggressionScore: analysis.aggressionScore,
    offenseScore: analysis.offenseScore,
    threatScore: analysis.threatScore,
    detectedWords: analysis.detectedWords,
    timestamp: analysis.createdAt,
    userId: analysis.userId?.toString(),
  };
}
```

### 8.3. Frontend display

Frontend natijalarni vizual ko'rsatadi (`Check.tsx:183-257`):

```typescript
{result && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Agressivlik */}
    <div className="bg-surface-container-lowest p-6 rounded-xl">
      <span className="text-3xl font-extrabold text-primary">
        {result.aggressionScore ?? 0}
      </span>
      <span className="text-sm font-bold text-outline">%</span>
    </div>
    {/* Haqorat */}
    <div className="bg-surface-container-lowest p-6 rounded-xl">
      <span className="text-3xl font-extrabold text-error">
        {result.offenseScore ?? 0}
      </span>
    </div>
    {/* Tahdid */}
    <div className="bg-surface-container-lowest p-6 rounded-xl">
      <span className="text-3xl font-extrabold text-secondary">
        {result.threatScore ?? 0}
      </span>
    </div>
  </div>
)}
```

## 9. XULOSA

Sentinella tizimi matnni qayta ishlashning kompleks jarayonini amalga oshiradi:

1. **Input Reception**: Frontend → API → Backend Controller → Service
2. **Validation**: Frontend (length check) + Backend (DTO validation)
3. **Cleaning**: `toLowerCase()` transformation
4. **Tokenization**:
   - Regex-based pattern matching
   - AI-based (GPT-4o-mini) semantic analysis
5. **Normalization**:
   - Score normalization (0-100)
   - Severity enum conversion
   - Toxicity level categorization
6. **Contextual Analysis**:
   - Punctuation analysis
   - CAPS LOCK detection
   - Pattern frequency counting
7. **Model Preparation**:
   - Hybrid approach (AI + Pattern-based)
   - MongoDB schema validation
   - Automatic moderation routing
8. **Response Formatting**: Structured JSON response

Tizimning asosiy afzalliklari:
- **Reliability**: Fallback pattern-based tahlil
- **Accuracy**: GPT-4o-mini AI model
- **Performance**: Efficient regex patterns
- **Scalability**: MongoDB + NestJS architecture
- **Localization**: O'zbek tiliga optimizatsiya qilingan

---

**Muallif**: Sentinella Development Team
**Sana**: 2026-04-16
**Versiya**: 1.0
