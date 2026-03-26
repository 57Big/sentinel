import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import {
  Analysis,
  AnalysisDocument,
} from '../analysis/schemas/analysis.schema';
import {
  Moderation,
  ModerationDocument,
} from '../moderation/schemas/moderation.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Analysis.name) private analysisModel: Model<AnalysisDocument>,
    @InjectModel(Moderation.name)
    private moderationModel: Model<ModerationDocument>,
  ) {}

  /**
   * Admin dashboard ma'lumotlarini olish
   */
  async getDashboard() {
    // Hozirgi vaqt
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalAnalyses,
      totalModeration,
      toxicAnalyses,
      recentUsers,
      // Oxirgi 30 kunlik ma'lumotlar
      analysesLast30Days,
      usersLast30Days,
      // Oldingi 30 kunlik ma'lumotlar (30-60 kunlar avval)
      analysesPrevious30Days,
      usersPrevious30Days,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.analysisModel.countDocuments(),
      this.moderationModel.countDocuments(),
      this.analysisModel.find({ toxicityLevel: 'toksik' }),
      this.userModel.aggregate([
        {
          $lookup: {
            from: 'analyses',
            localField: '_id',
            foreignField: 'userId',
            as: 'analyses',
          },
        },
        {
          $project: {
            userId: '$_id',
            username: '$name',
            email: '$email',
            analysisCount: { $size: '$analyses' },
            lastActive: '$updatedAt',
          },
        },
        { $sort: { lastActive: -1 } },
        { $limit: 10 },
      ]),
      // Oxirgi 30 kunlik statistika
      this.analysisModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      this.userModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      // Oldingi 30 kunlik statistika
      this.analysisModel.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
      this.userModel.countDocuments({
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      }),
    ]);

    const avgToxicityScore = await this.analysisModel.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$toxicityScore' },
        },
      },
    ]);

    const toxicContentPercentage =
      totalAnalyses > 0 ? (toxicAnalyses.length / totalAnalyses) * 100 : 0;

    // O'sish foizlarini hisoblash
    const analysesGrowthPercentage =
      analysesPrevious30Days > 0
        ? ((analysesLast30Days - analysesPrevious30Days) /
            analysesPrevious30Days) *
          100
        : analysesLast30Days > 0
          ? 100
          : 0;

    const usersGrowthPercentage =
      usersPrevious30Days > 0
        ? ((usersLast30Days - usersPrevious30Days) / usersPrevious30Days) * 100
        : usersLast30Days > 0
          ? 100
          : 0;

    return {
      stats: {
        totalUsers,
        totalAnalyses,
        totalModeration,
        averageToxicityScore: avgToxicityScore[0]?.avgScore || 0,
        toxicContentPercentage,
        analysesGrowthPercentage: Number(analysesGrowthPercentage.toFixed(1)),
        usersGrowthPercentage: Number(usersGrowthPercentage.toFixed(1)),
      },
      recentUsers,
    };
  }

  /**
   * Barcha foydalanuvchilar ro'yxatini olish (pagination bilan)
   */
  async getAllUsers(params: {
    page: number;
    pageSize: number;
    search?: string;
    role?: string;
  }) {
    const { page = 1, pageSize = 10, search, role } = params;
    const skip = (page - 1) * pageSize;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password')
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Foydalanuvchi rolini o'zgartirish
   */
  async updateUserRole(userId: string, role: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!['user', 'moderator', 'admin'].includes(role)) {
      throw new BadRequestException("Noto'g'ri rol");
    }

    user.role = role as any;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Foydalanuvchini bloklash/blokdan chiqarish
   */
  async toggleUserBlock(userId: string, blocked: boolean) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    user.blocked = blocked;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  }

  /**
   * Foydalanuvchini o'chirish
   */
  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    await this.userModel.findByIdAndDelete(userId);
  }

  /**
   * Tizim sozlamalarini olish
   */
  async getSystemSettings() {
    // Bu yerda real sozlamalar bo'lishi kerak, hozircha default qiymatlar
    return {
      toxicityThreshold: 70,
      autoModeration: true,
      emailNotifications: false,
      maxAnalysisPerDay: 100,
    };
  }

  /**
   * Tizim sozlamalarini yangilash
   */
  async updateSystemSettings(settings: any) {
    // Bu yerda real sozlamalarni saqlash logikasi bo'lishi kerak
    // Hozircha faqat qaytaramiz
    return settings;
  }

  /**
   * Statistika (oxirgi N kun)
   * @param numberOfDays - Necha kunlik statistika (7 yoki 30)
   */
  async getWeeklyStatistics(numberOfDays: number = 7) {
    const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const statisticsData = [];

    // Oxirgi N kunlik ma'lumotlarni olish
    for (let i = numberOfDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await this.analysisModel.countDocuments({
        createdAt: {
          $gte: date,
          $lt: nextDate,
        },
      });

      const dayIndex = date.getDay();
      const dayLabel =
        numberOfDays <= 7
          ? dayNames[dayIndex]
          : `${date.getDate()}/${date.getMonth() + 1}`;

      statisticsData.push({
        day: dayLabel,
        count,
        date: date.toISOString(),
      });
    }

    return statisticsData;
  }

  /**
   * So'nggi xavfli matnlar
   */
  async getRecentDangerousContent(limit: number = 10) {
    const dangerousContent = await this.analysisModel
      .find({
        toxicityLevel: 'toksik',
      })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return dangerousContent.map((item: any) => ({
      id: item._id,
      text: item.originalText,
      severity:
        item.toxicityScore >= 80
          ? 'Juda xavfli'
          : item.toxicityScore >= 60
            ? 'Tahdid'
            : 'Haqorat',
      toxicityScore: item.toxicityScore,
      time: this.getTimeAgo(item.createdAt),
      createdAt: item.createdAt,
      user: {
        id: item.userId?._id || 'unknown',
        name: item.userId?.name || 'Anonymous',
        email: item.userId?.email || '',
      },
    }));
  }

  /**
   * Vaqtni "X vaqt avval" formatida qaytarish
   */
  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Hozir';
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa avval`;
    if (diffInHours < 24) return `${diffInHours} soat avval`;
    return `${diffInDays} kun avval`;
  }
}
