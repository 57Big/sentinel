# Ma'lumotlar Bazasi Arxitekturasi - Sentinella Tizimi

## 1. Ma'lumotlar Bazasi Texnologiyasi

### 1.1. Tanlangan Texnologiya: MongoDB

**MongoDB 6.x** - Document-oriented NoSQL ma'lumotlar bazasi

**Tanlov sabablari:**

1. **Schema Flexibility (Moslashuvchan struktura)**
   - JSON-tipidagi dokumentlar bilan ishlash
   - Dinamik fieldlar qo'shish imkoniyati
   - Nested objektlar (ichki obyektlar) va array'larni qo'llab-quvvatlash

2. **Scalability (Miqyoslanuvchi)**
   - Horizontal scaling (sharding) qo'llab-quvvatlaydi
   - Replica sets orqali yuqori mavjudlik (high availability)
   - Katta hajmdagi ma'lumotlarni samarali boshqarish

3. **Performance (Yuqori samaradorlik)**
   - Indexing mexanizmi
   - Query optimization
   - Aggregation pipeline (murakkab tahlillar uchun)

4. **Developer-Friendly**
   - JavaScript/TypeScript bilan yaxshi integratsiya
   - Mongoose ODM orqali type-safe development
   - JSON formatida oddiy ishlash

5. **Use Case Compatibility**
   - Text-heavy ma'lumotlar uchun ideal
   - Real-time analytics qo'llab-quvvatlaydi
   - Unstructured va semi-structured ma'lumotlar uchun

**PostgreSQL yoki MySQL ga nisbatan afzalliklari:**
- Schema o'zgarishlarida flexibility
- Nested documents (DetectedWords, Review Notes)
- Tezkor agregatsiya va statistika
- Horizontal scaling osonroq

---

## 2. Ulanish Konfiguratsiyasi

### 2.1. Mongoose ODM

**Mongoose 8.x** - MongoDB uchun Object Data Modeling (ODM) library

**Ulanish usuli:**

```typescript
// app.module.ts
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
  inject: [ConfigService],
})
```

**Environment o'zgaruvchilari (`.env`):**

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/sentinella

# MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sentinella?retryWrites=true&w=majority
```

### 2.2. Ulanish Parametrlari

| Parameter | Qiymat | Ma'nosi |
|-----------|--------|---------|
| **Database nomi** | `sentinella` | Loyiha ma'lumotlar bazasi |
| **Connection Pooling** | Auto | Mongoose avtomatik boshqaradi |
| **Retry Strategy** | `retryWrites=true` | Xatolikda qayta urinish |
| **Write Concern** | `w=majority` | Majority serverlar tasdiqlashi |
| **Read Preference** | `primary` | Asosiy serverdan o'qish |

---

## 3. Ma'lumotlar Strukturasi

### 3.1. Ma'lumotlar Modeli (ER Diagram)

```
┌─────────────────┐
│      Users      │
│   (users)       │
├─────────────────┤
│ _id: ObjectId   │◄───┐
│ name: String    │    │
│ email: String   │    │ 1:N
│ password: String│    │
│ role: Enum      │    │
│ blocked: Bool   │    │
│ createdAt: Date │    │
│ updatedAt: Date │    │
└─────────────────┘    │
                       │
                       │
         ┌─────────────┴──────────────┬──────────────────┐
         │                            │                  │
         │                            │                  │
┌────────▼──────────┐   ┌─────────────▼──────┐  ┌───────▼──────────────┐
│    Analyses       │   │   Moderations      │  │  (Future: Reports)   │
│   (analyses)      │   │  (moderations)     │  │                      │
├───────────────────┤   ├────────────────────┤  └──────────────────────┘
│ _id: ObjectId     │   │ _id: ObjectId      │
│ originalText: Str │   │ content: String    │
│ toxicityLevel:Enum│   │ toxicityLevel:Enum │
│ toxicityScore: Num│   │ toxicityScore: Num │
│ aggressionScore   │   │ status: Enum       │
│ offenseScore      │   │ submittedBy: ObjId │──┐
│ threatScore       │   │ submittedAt: Date  │  │
│ detectedWords: [] │   │ reviewedBy: ObjId  │──┤
│ userId: ObjectId  │──►│ reviewedAt: Date   │  │ (Reference to Users)
│ createdAt: Date   │   │ reviewNotes: String│  │
│ updatedAt: Date   │   │ createdAt: Date    │  │
└───────────────────┘   │ updatedAt: Date    │  │
                        └────────────────────┘  │
                                                │
                                                └─────────┐
                                                          │
                                            (Optional: User who reviewed)
```

---

## 4. Kolleksiyalar (Collections)

### 4.1. Users Collection

**Kolleksiya nomi:** `users`

**Schema Definition:**

```typescript
@Schema({ timestamps: true })
export class User {
  _id: ObjectId;              // MongoDB avtomatik yaratadi

  @Prop({ required: true, minlength: 2 })
  name: string;               // Foydalanuvchi ismi

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;              // Email (unique index)

  @Prop({ required: true })
  password: string;           // Bcrypt hash (60 ta belgi)

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;             // 'user' | 'moderator' | 'admin'

  @Prop({ type: Boolean, default: false })
  blocked: boolean;           // Bloklanganlik holati

  createdAt: Date;            // Avtomatik (timestamps: true)
  updatedAt: Date;            // Avtomatik (timestamps: true)
}
```

**Enum: UserRole**

```typescript
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}
```

**Document misoli:**

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Shamshod Yusupov",
  "email": "shamshod@example.com",
  "password": "$2b$10$rX8KJZ9fN3qW2mL5vY6tOuH4pS7dF9gT3eR1wQ8zX5cV2nM4kL6jK",
  "role": "user",
  "blocked": false,
  "createdAt": "2024-03-26T10:00:00.000Z",
  "updatedAt": "2024-03-26T10:00:00.000Z"
}
```

**Indexlar:**

```typescript
// Mongoose avtomatik yaratadi:
// - email: unique index
// - _id: primary key index
```

**Xavfsizlik:**
- Parol bcrypt bilan hash qilingan (10 rounds)
- Email lowercase va unique
- Password fieldni API response'dan o'chirish: `.select('-password')`

---

### 4.2. Analyses Collection

**Kolleksiya nomi:** `analyses`

**Schema Definition:**

```typescript
@Schema({ timestamps: true })
export class Analysis {
  _id: ObjectId;

  @Prop({ required: true })
  originalText: string;                    // Tahlil qilingan matn

  @Prop({
    type: String,
    enum: ToxicityLevel,
    required: true
  })
  toxicityLevel: ToxicityLevel;           // 'xavfsiz' | 'shubhali' | 'toksik'

  @Prop({ required: true, min: 0, max: 100 })
  toxicityScore: number;                   // 0-100

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  aggressionScore?: number;                // Tajovuz balli

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  offenseScore?: number;                   // Haqorat balli

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  threatScore?: number;                    // Tahdid balli

  @Prop({ type: [Object], default: [] })
  detectedWords: DetectedWord[];           // Topilgan toksik so'zlar

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;                 // Foydalanuvchi ID (reference)

  createdAt: Date;
  updatedAt: Date;
}
```

**Nested Interface: DetectedWord**

```typescript
export interface DetectedWord {
  word: string;         // Topilgan so'z
  position: number;     // Matndagi pozitsiyasi
  severity: Severity;   // 'low' | 'medium' | 'high'
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
```

**Document misoli:**

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "originalText": "Sen ahmoqsan, seni qidirib topaman!",
  "toxicityLevel": "toksik",
  "toxicityScore": 85,
  "aggressionScore": 70,
  "offenseScore": 60,
  "threatScore": 90,
  "detectedWords": [
    {
      "word": "ahmoq",
      "position": 4,
      "severity": "high"
    },
    {
      "word": "qidirib topaman",
      "position": 20,
      "severity": "high"
    }
  ],
  "userId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "createdAt": "2024-03-26T10:35:00.000Z",
  "updatedAt": "2024-03-26T10:35:00.000Z"
}
```

**Indexlar:**

```typescript
AnalysisSchema.index({ userId: 1, createdAt: -1 });  // Foydalanuvchi tarixini tezkor olish
AnalysisSchema.index({ toxicityLevel: 1 });          // Level bo'yicha filtrlash
AnalysisSchema.index({ createdAt: -1 });             // Vaqt bo'yicha saralash
```

**Index tushuntirish:**
- `userId: 1, createdAt: -1` - Compound index (foydalanuvchi tarixi uchun)
- `1` - ascending order (o'sish tartibida)
- `-1` - descending order (kamayish tartibida)

---

### 4.3. Moderations Collection

**Kolleksiya nomi:** `moderations`

**Schema Definition:**

```typescript
@Schema({ timestamps: true })
export class Moderation {
  _id: ObjectId;

  @Prop({ required: true })
  content: string;                         // Moderatsiya kutayotgan matn

  @Prop({
    type: String,
    enum: ToxicityLevel,
    required: true
  })
  toxicityLevel: ToxicityLevel;           // 'xavfsiz' | 'shubhali' | 'toksik'

  @Prop({ required: true, min: 0, max: 100 })
  toxicityScore: number;                   // Toksiklik balli

  @Prop({
    type: String,
    enum: ModerationStatus,
    default: ModerationStatus.PENDING
  })
  status: ModerationStatus;                // 'pending' | 'approved' | 'rejected'

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  submittedBy: Types.ObjectId;             // Kim yubordi (User reference)

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;                       // Yuborilgan vaqt

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  reviewedBy?: Types.ObjectId;             // Moderator (User reference)

  @Prop({ type: Date, required: false })
  reviewedAt?: Date;                       // Ko'rib chiqilgan vaqt

  @Prop({ type: String, required: false })
  reviewNotes?: string;                    // Moderator eslatmalari

  createdAt: Date;
  updatedAt: Date;
}
```

**Enum: ModerationStatus**

```typescript
export enum ModerationStatus {
  PENDING = 'pending',       // Moderatsiya kutilmoqda
  APPROVED = 'approved',     // Tasdiqlangan (false positive)
  REJECTED = 'rejected'      // Rad etilgan (haqiqatan toksik)
}
```

**Document misoli (Pending):**

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "content": "Bu juda yomon gap, seni pushaymon qildiraman!",
  "toxicityLevel": "toksik",
  "toxicityScore": 85,
  "status": "pending",
  "submittedBy": "65f1a2b3c4d5e6f7g8h9i0j1",
  "submittedAt": "2024-03-26T10:35:00.000Z",
  "reviewedBy": null,
  "reviewedAt": null,
  "reviewNotes": null,
  "createdAt": "2024-03-26T10:35:00.000Z",
  "updatedAt": "2024-03-26T10:35:00.000Z"
}
```

**Document misoli (Approved by Moderator):**

```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
  "content": "Bu juda yomon gap, seni pushaymon qildiraman!",
  "toxicityLevel": "toksik",
  "toxicityScore": 85,
  "status": "approved",
  "submittedBy": "65f1a2b3c4d5e6f7g8h9i0j1",
  "submittedAt": "2024-03-26T10:35:00.000Z",
  "reviewedBy": "65f1a2b3c4d5e6f7g8h9i0j4",
  "reviewedAt": "2024-03-26T11:00:00.000Z",
  "reviewNotes": "False positive - bu oddiy gap, toksik emas",
  "createdAt": "2024-03-26T10:35:00.000Z",
  "updatedAt": "2024-03-26T11:00:00.000Z"
}
```

**Indexlar:**

```typescript
ModerationSchema.index({ status: 1, submittedAt: -1 }); // Status bo'yicha tezkor filtrlash
ModerationSchema.index({ submittedBy: 1 });             // Foydalanuvchi bo'yicha qidirish
ModerationSchema.index({ reviewedBy: 1 });              // Moderator bo'yicha qidirish
ModerationSchema.index({ toxicityLevel: 1 });           // Darajasi bo'yicha filtrlash
```

---

## 5. API orqali Ma'lumotlar Bazasi bilan Ishlash

### 5.1. CRUD Operatsiyalari

#### 5.1.1. CREATE (Yaratish)

**User yaratish (Register):**

```typescript
// auth.service.ts
async register(registerDto: RegisterDto) {
  // 1. Emailni tekshirish
  const existingUser = await this.userModel.findOne({
    email: registerDto.email
  });

  if (existingUser) {
    throw new ConflictException('Email allaqachon mavjud');
  }

  // 2. Parolni hash qilish
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  // 3. Yangi user yaratish
  const newUser = new this.userModel({
    name: registerDto.name,
    email: registerDto.email,
    password: hashedPassword,
    role: UserRole.USER,
    blocked: false
  });

  // 4. MongoDB ga saqlash
  const savedUser = await newUser.save();

  return savedUser;
}
```

**MongoDB Query:**
```javascript
db.users.insertOne({
  name: "Shamshod Yusupov",
  email: "shamshod@example.com",
  password: "$2b$10$...",
  role: "user",
  blocked: false,
  createdAt: ISODate("2024-03-26T10:00:00Z"),
  updatedAt: ISODate("2024-03-26T10:00:00Z")
})
```

---

**Analysis yaratish:**

```typescript
// analysis.service.ts
async analyzeText(createAnalysisDto: CreateAnalysisDto) {
  // 1. OpenAI yoki pattern-based tahlil
  const analysisResult = await this.openAIService.analyzeToxicity(text);

  // 2. Analysis dokumenti yaratish
  const analysis = new this.analysisModel({
    originalText: text,
    toxicityLevel: analysisResult.toxicityLevel,
    toxicityScore: analysisResult.toxicityScore,
    aggressionScore: analysisResult.aggressionScore,
    offenseScore: analysisResult.offenseScore,
    threatScore: analysisResult.threatScore,
    detectedWords: analysisResult.detectedWords,
    userId: new Types.ObjectId(userId)
  });

  // 3. MongoDB ga saqlash
  const savedAnalysis = await analysis.save();

  return savedAnalysis;
}
```

**MongoDB Query:**
```javascript
db.analyses.insertOne({
  originalText: "Sen ahmoqsan!",
  toxicityLevel: "toksik",
  toxicityScore: 75,
  aggressionScore: 60,
  offenseScore: 70,
  threatScore: 20,
  detectedWords: [
    { word: "ahmoq", position: 4, severity: "high" }
  ],
  userId: ObjectId("65f1a2b3c4d5e6f7g8h9i0j1"),
  createdAt: ISODate("2024-03-26T10:35:00Z"),
  updatedAt: ISODate("2024-03-26T10:35:00Z")
})
```

---

#### 5.1.2. READ (O'qish)

**Foydalanuvchini topish:**

```typescript
// users.service.ts
async findByEmail(email: string): Promise<UserDocument | null> {
  return this.userModel.findOne({ email }).exec();
}

async findById(id: string): Promise<UserDocument | null> {
  return this.userModel.findById(id).exec();
}
```

**MongoDB Query:**
```javascript
// Email bo'yicha
db.users.findOne({ email: "shamshod@example.com" })

// ID bo'yicha
db.users.findOne({ _id: ObjectId("65f1a2b3c4d5e6f7g8h9i0j1") })
```

---

**Tahlil tarixini olish (Pagination):**

```typescript
// analysis.service.ts
async getUserHistory(userId: string, queryDto: QueryAnalysisDto) {
  const { page, pageSize, sortBy, sortOrder } = queryDto;

  const skip = (page - 1) * pageSize;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  // Parallel queries (tezroq)
  const [results, total] = await Promise.all([
    this.analysisModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .exec(),

    this.analysisModel.countDocuments({
      userId: new Types.ObjectId(userId)
    })
  ]);

  return {
    results: results.map(item => this.formatListItem(item)),
    total,
    page,
    pageSize
  };
}
```

**MongoDB Query:**
```javascript
// Results
db.analyses.find({ userId: ObjectId("65f1a2b3...") })
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(10)

// Count
db.analyses.countDocuments({ userId: ObjectId("65f1a2b3...") })
```

---

**Moderatsiya ro'yxati (Filtrlash):**

```typescript
// moderation.service.ts
async getModerationList(query: ModerationListDto) {
  const { page, pageSize, status } = query;
  const skip = (page - 1) * pageSize;

  const filter: any = {};
  if (status) {
    filter.status = status;  // 'pending', 'approved', 'rejected'
  }

  const [items, total] = await Promise.all([
    this.moderationModel
      .find(filter)
      .populate('submittedBy', 'name email')  // User ma'lumotlarini join qilish
      .populate('reviewedBy', 'name email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),  // Plain JavaScript object (tezroq)

    this.moderationModel.countDocuments(filter)
  ]);

  return { items, total, page, pageSize };
}
```

**MongoDB Query:**
```javascript
// Aggregation (populate o'rniga)
db.moderations.aggregate([
  { $match: { status: "pending" } },
  {
    $lookup: {
      from: "users",
      localField: "submittedBy",
      foreignField: "_id",
      as: "submittedByUser"
    }
  },
  { $unwind: "$submittedByUser" },
  { $sort: { submittedAt: -1 } },
  { $skip: 0 },
  { $limit: 10 }
])
```

---

#### 5.1.3. UPDATE (Yangilash)

**Foydalanuvchi rolini o'zgartirish:**

```typescript
// admin.service.ts
async updateUserRole(userId: string, role: string) {
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('Foydalanuvchi topilmadi');
  }

  user.role = role as UserRole;
  await user.save();  // MongoDB ga yangilash

  return user;
}
```

**MongoDB Query:**
```javascript
db.users.updateOne(
  { _id: ObjectId("65f1a2b3...") },
  {
    $set: {
      role: "moderator",
      updatedAt: ISODate("2024-03-26T11:00:00Z")
    }
  }
)
```

---

**Moderatsiya harakati (Tasdiqlash/Rad etish):**

```typescript
// moderation.service.ts
async performModerationAction(actionDto: ModerationActionDto, moderatorId: string) {
  const { itemId, action, notes } = actionDto;

  const item = await this.moderationModel.findById(itemId);

  if (!item) {
    throw new NotFoundException('Element topilmadi');
  }

  item.status = action === 'approve'
    ? ModerationStatus.APPROVED
    : ModerationStatus.REJECTED;

  item.reviewedBy = new Types.ObjectId(moderatorId);
  item.reviewedAt = new Date();
  item.reviewNotes = notes;

  await item.save();

  return item;
}
```

**MongoDB Query:**
```javascript
db.moderations.updateOne(
  { _id: ObjectId("65f1a2b3...") },
  {
    $set: {
      status: "approved",
      reviewedBy: ObjectId("65f1a2b3..."),
      reviewedAt: ISODate("2024-03-26T11:00:00Z"),
      reviewNotes: "False positive",
      updatedAt: ISODate("2024-03-26T11:00:00Z")
    }
  }
)
```

---

#### 5.1.4. DELETE (O'chirish)

**Tahlilni o'chirish:**

```typescript
// analysis.service.ts
async deleteAnalysis(analysisId: string, userId: string) {
  const analysis = await this.analysisModel.findById(analysisId);

  if (!analysis) {
    throw new NotFoundException('Tahlil topilmadi');
  }

  // Faqat o'z tahlilini o'chirishi mumkin
  if (analysis.userId?.toString() !== userId) {
    throw new BadRequestException("Ruxsat yo'q");
  }

  await this.analysisModel.findByIdAndDelete(analysisId);
}
```

**MongoDB Query:**
```javascript
db.analyses.deleteOne({
  _id: ObjectId("65f1a2b3..."),
  userId: ObjectId("65f1a2b3...")
})
```

---

**Foydalanuvchini o'chirish (Admin):**

```typescript
// admin.service.ts
async deleteUser(userId: string) {
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('Foydalanuvchi topilmadi');
  }

  await this.userModel.findByIdAndDelete(userId);
}
```

**MongoDB Query:**
```javascript
db.users.deleteOne({ _id: ObjectId("65f1a2b3...") })
```

---

### 5.2. Murakkab Query'lar

#### 5.2.1. Aggregation Pipeline

**Dashboard statistikasi:**

```typescript
// admin.service.ts
async getDashboard() {
  // O'rtacha toksiklik ballini hisoblash
  const avgToxicityScore = await this.analysisModel.aggregate([
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$toxicityScore' }
      }
    }
  ]);

  // Foydalanuvchilarning tahlil soni bilan
  const recentUsers = await this.userModel.aggregate([
    {
      $lookup: {
        from: 'analyses',           // Join with analyses collection
        localField: '_id',
        foreignField: 'userId',
        as: 'analyses'
      }
    },
    {
      $project: {
        userId: '$_id',
        username: '$name',
        email: '$email',
        analysisCount: { $size: '$analyses' },
        lastActive: '$updatedAt'
      }
    },
    { $sort: { lastActive: -1 } },
    { $limit: 10 }
  ]);

  return { avgToxicityScore, recentUsers };
}
```

**MongoDB Aggregation Pipeline:**
```javascript
// O'rtacha toksiklik
db.analyses.aggregate([
  {
    $group: {
      _id: null,
      avgScore: { $avg: "$toxicityScore" }
    }
  }
])

// Foydalanuvchilar + tahlil soni
db.users.aggregate([
  {
    $lookup: {
      from: "analyses",
      localField: "_id",
      foreignField: "userId",
      as: "analyses"
    }
  },
  {
    $project: {
      username: "$name",
      email: 1,
      analysisCount: { $size: "$analyses" },
      lastActive: "$updatedAt"
    }
  },
  { $sort: { lastActive: -1 } },
  { $limit: 10 }
])
```

---

#### 5.2.2. Vaqt bo'yicha Statistika

**Haftalik tahlillar soni:**

```typescript
// admin.service.ts
async getWeeklyStatistics(numberOfDays: number = 7) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const statisticsData = [];

  for (let i = numberOfDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    // Bir kunlik tahlillar soni
    const count = await this.analysisModel.countDocuments({
      createdAt: {
        $gte: date,      // >=
        $lt: nextDate    // <
      }
    });

    statisticsData.push({
      day: date.toLocaleDateString(),
      count
    });
  }

  return statisticsData;
}
```

**MongoDB Query:**
```javascript
db.analyses.countDocuments({
  createdAt: {
    $gte: ISODate("2024-03-26T00:00:00Z"),
    $lt: ISODate("2024-03-27T00:00:00Z")
  }
})
```

---

#### 5.2.3. Qidiruv va Filtrlash

**Foydalanuvchilarni qidirish:**

```typescript
// admin.service.ts
async getAllUsers(params: { page, pageSize, search?, role? }) {
  const { page, pageSize, search, role } = params;
  const skip = (page - 1) * pageSize;

  // Dinamik query
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },   // Case-insensitive
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  if (role) {
    query.role = role;
  }

  const [users, total] = await Promise.all([
    this.userModel
      .find(query)
      .select('-password')  // Parolni chiqarmaslik
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),

    this.userModel.countDocuments(query)
  ]);

  return { users, total, page, pageSize };
}
```

**MongoDB Query:**
```javascript
db.users.find({
  $or: [
    { name: { $regex: "shamshod", $options: "i" } },
    { email: { $regex: "shamshod", $options: "i" } }
  ],
  role: "user"
})
.select("-password")
.sort({ createdAt: -1 })
.skip(0)
.limit(10)
```

---

## 6. Optimizatsiya va Performance

### 6.1. Indexlar (Indexes)

**Mavjud indexlar:**

| Collection | Index | Type | Purpose |
|------------|-------|------|---------|
| **users** | `email` | Unique | Email bo'yicha tezkor qidirish |
| **users** | `_id` | Primary | MongoDB default |
| **analyses** | `userId + createdAt` | Compound | Foydalanuvchi tarixi |
| **analyses** | `toxicityLevel` | Single | Level filtrlash |
| **analyses** | `createdAt` | Single | Vaqt bo'yicha saralash |
| **moderations** | `status + submittedAt` | Compound | Status filtrlash |
| **moderations** | `submittedBy` | Single | Foydalanuvchi bo'yicha |
| **moderations** | `reviewedBy` | Single | Moderator bo'yicha |
| **moderations** | `toxicityLevel` | Single | Daraja bo'yicha |

**Index Performance:**

```typescript
// Index'siz (slow)
db.analyses.find({ userId: ObjectId("...") }).explain("executionStats")
// executionTimeMillis: 150ms (collection scan)

// Index bilan (fast)
db.analyses.find({ userId: ObjectId("...") }).explain("executionStats")
// executionTimeMillis: 5ms (index scan)
```

---

### 6.2. Query Optimization

**1. Parallel Queries (Promise.all):**

```typescript
// ❌ Ketma-ket (sekin)
const users = await this.userModel.find();
const analyses = await this.analysisModel.find();
// Total: 100ms + 150ms = 250ms

// ✅ Parallel (tez)
const [users, analyses] = await Promise.all([
  this.userModel.find(),
  this.analysisModel.find()
]);
// Total: max(100ms, 150ms) = 150ms
```

---

**2. Lean() (Memory Efficiency):**

```typescript
// ❌ Mongoose Document (og'ir)
const users = await this.userModel.find();
// Memory: ~5KB per document

// ✅ Plain JavaScript Object (yengil)
const users = await this.userModel.find().lean();
// Memory: ~2KB per document
```

---

**3. Select (Projection):**

```typescript
// ❌ Barcha fieldlarni olish
const users = await this.userModel.find();

// ✅ Faqat kerakli fieldlar
const users = await this.userModel
  .find()
  .select('name email role');  // Faqat 3 ta field
```

---

**4. Limit va Skip:**

```typescript
// ❌ Barcha ma'lumotlarni yuklash
const analyses = await this.analysisModel.find();

// ✅ Pagination
const analyses = await this.analysisModel
  .find()
  .skip((page - 1) * pageSize)
  .limit(pageSize);
```

---

### 6.3. Connection Pooling

Mongoose avtomatik connection pooling qiladi:

```typescript
// Default pool size: 5
// Max pool size: 100

MongooseModule.forRoot('mongodb://...', {
  maxPoolSize: 10,      // Maksimal 10 ta connection
  minPoolSize: 5,       // Minimal 5 ta connection
  serverSelectionTimeoutMS: 5000
})
```

---

## 7. Xavfsizlik (Security)

### 7.1. Input Validatsiya

**Mongoose Schema Validation:**

```typescript
@Prop({ required: true, minlength: 2, maxlength: 100 })
name: string;

@Prop({ required: true, unique: true, lowercase: true })
email: string;

@Prop({ required: true, min: 0, max: 100 })
toxicityScore: number;
```

---

### 7.2. MongoDB Injection Protection

**Mongoose avtomatik himoya qiladi:**

```typescript
// ❌ SQL Injection (SQL databases)
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
// email = "' OR '1'='1" -> barcha userlar

// ✅ MongoDB + Mongoose (Safe)
const user = await this.userModel.findOne({ email });
// Mongoose avtomatik sanitize qiladi
```

---

### 7.3. Password Hashing

```typescript
// Parolni saqlashdan oldin hash qilish
const hashedPassword = await bcrypt.hash(password, 10);

// Parolni tekshirish
const isMatch = await bcrypt.compare(inputPassword, user.password);
```

---

### 7.4. Sensitive Ma'lumotlarni Yashirish

```typescript
// API response'dan parolni o'chirish
const users = await this.userModel
  .find()
  .select('-password');  // Password fieldni chiqarmaslik

// Yoki
const userObject = user.toObject();
delete userObject.password;
```

---

## 8. Backup va Disaster Recovery

### 8.1. Backup Strategiyasi

**Tavsiya etiladigan yondashuv:**

1. **Automated Daily Backups** (MongoDB Atlas)
2. **Point-in-Time Recovery**
3. **Geo-Redundancy** (3 ta datacenter)

**Manual Backup (mongodump):**

```bash
# Backup yaratish
mongodump --uri="mongodb://localhost:27017/sentinella" --out=/backup/2024-03-26

# Backup'dan tiklash
mongorestore --uri="mongodb://localhost:27017/sentinella" /backup/2024-03-26
```

---

### 8.2. Data Retention Policy

**Tavsiya:**
- **Analyses:** 2 yil saqlash
- **Moderations:** 1 yil saqlash
- **Users:** Foydalanuvchi o'chirgunga qadar

---

## 9. Monitoring va Logging

### 9.1. Query Performance Monitoring

```typescript
// Mongoose middleware (query logging)
AnalysisSchema.pre('find', function(next) {
  console.time('find query');
  next();
});

AnalysisSchema.post('find', function(docs, next) {
  console.timeEnd('find query');
  next();
});
```

---

### 9.2. MongoDB Atlas Monitoring

- **Real-time Metrics:** CPU, Memory, Disk I/O
- **Slow Query Alerts:** 100ms dan sekin query'lar
- **Connection Pool Monitoring**

---

## 10. Kelajakda Kengaytirish

### 10.1. Yangi Kolleksiyalar

**1. Settings Collection** (Tizim sozlamalari)

```typescript
{
  _id: ObjectId,
  toxicityThreshold: 70,
  autoModeration: true,
  maxAnalysisPerDay: 100,
  updatedAt: Date
}
```

**2. Reports Collection** (Hisobotlar)

```typescript
{
  _id: ObjectId,
  type: 'daily' | 'weekly' | 'monthly',
  generatedAt: Date,
  data: Object
}
```

**3. Notifications Collection** (Bildirishnomalar)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'warning' | 'info',
  message: String,
  read: Boolean,
  createdAt: Date
}
```

---

### 10.2. Sharding (Horizontal Scaling)

Katta hajmdagi ma'lumotlar uchun:

```javascript
// Shard key
sh.shardCollection("sentinella.analyses", { userId: 1, createdAt: 1 })
```

---

### 10.3. Read Replicas

Read-heavy workload uchun:

```typescript
MongooseModule.forRoot('mongodb://...', {
  readPreference: 'secondaryPreferred'  // Read replica'lardan o'qish
})
```

---

## 11. Xulosa

Sentinella tizimi **MongoDB 6.x** va **Mongoose 8.x ODM** asosida qurilgan bo'lib, **3 ta asosiy kolleksiya** mavjud:

1. **Users** - Autentifikatsiya va avtorizatsiya
2. **Analyses** - Matn tahlillari tarixi
3. **Moderations** - Moderatsiya tizimi

**Asosiy xususiyatlar:**
- ✅ Schema validation
- ✅ Indexlar (tezkor query'lar)
- ✅ Aggregation pipeline (murakkab statistika)
- ✅ Populate (JOIN operatsiyalari)
- ✅ Pagination va filtrlash
- ✅ Security (input validation, password hashing)
- ✅ Performance optimization (lean, select, parallel queries)

**Arxitektura afzalliklari:**
- 🚀 Scalable (horizontal va vertical scaling)
- 🔒 Secure (Mongoose ORM himoyasi)
- ⚡ Fast (indexlar va optimizatsiya)
- 🛠️ Flexible (schema evolution)
- 📊 Analytics-friendly (aggregation pipeline)

Bu arxitektura 100,000+ foydalanuvchi va millionlab tahlillarni qo'llab-quvvatlashga qodir.
