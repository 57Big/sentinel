import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Moderation,
  ModerationDocument,
  ModerationStatus,
  ToxicityLevel,
} from './schemas/moderation.schema';
import {
  ModerationActionDto,
  ModerationAction,
} from './dto/moderation-action.dto';
import {
  ModerationListDto,
  ModerationFilterStatus,
} from './dto/moderation-list.dto';

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(Moderation.name)
    private moderationModel: Model<ModerationDocument>,
  ) {}

  /**
   * Moderatsiya elementlarini ro'yxatini olish
   */
  async getModerationList(query: ModerationListDto) {
    const {
      page = 1,
      pageSize = 10,
      status,
      sortBy = 'submittedAt',
      sortOrder = 'desc',
    } = query;

    // Filter qurilish
    const filter: any = {};

    if (status) {
      if (status === ModerationFilterStatus.TOXIC) {
        filter.toxicityLevel = ToxicityLevel.TOKSIK;
      } else if (status === ModerationFilterStatus.SUSPICIOUS) {
        filter.toxicityLevel = ToxicityLevel.SHUBHALI;
      } else {
        filter.status = status;
      }
    } else {
      // Default: faqat pending elementlarni ko'rsatish
      filter.status = ModerationStatus.PENDING;
    }

    // Pagination
    const skip = (page - 1) * pageSize;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Ma'lumotlarni olish
    const [items, total] = await Promise.all([
      this.moderationModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .populate('submittedBy', 'name email')
        .populate('reviewedBy', 'name email')
        .exec(),
      this.moderationModel.countDocuments(filter),
    ]);

    return {
      success: true,
      message: "Moderatsiya ro'yxati yuklandi",
      data: {
        items: items.map((item) => this.formatModerationItem(item)),
        total,
        page,
        pageSize,
      },
    };
  }

  /**
   * Moderatsiya elementini ID bo'yicha olish
   */
  async getModerationItemById(itemId: string) {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new BadRequestException("Noto'g'ri ID formati");
    }

    const item = await this.moderationModel
      .findById(itemId)
      .populate('submittedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .exec();

    if (!item) {
      throw new NotFoundException('Element topilmadi');
    }

    return {
      success: true,
      message: 'Element topildi',
      data: this.formatModerationItem(item),
    };
  }

  /**
   * Moderatsiya harakatini amalga oshirish
   */
  async moderateItem(actionDto: ModerationActionDto, userId: string) {
    const { itemId, action, notes } = actionDto;

    if (!Types.ObjectId.isValid(itemId)) {
      throw new BadRequestException("Noto'g'ri ID formati");
    }

    const item = await this.moderationModel.findById(itemId);

    if (!item) {
      throw new NotFoundException('Element topilmadi');
    }

    // Statusni yangilash
    item.status =
      action === ModerationAction.APPROVE
        ? ModerationStatus.APPROVED
        : ModerationStatus.REJECTED;
    item.reviewedBy = new Types.ObjectId(userId);
    item.reviewedAt = new Date();
    if (notes) {
      item.reviewNotes = notes;
    }

    await item.save();

    const populatedItem = await this.moderationModel
      .findById(itemId)
      .populate('submittedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .exec();

    return {
      success: true,
      message:
        action === ModerationAction.APPROVE
          ? 'Element tasdiqlandi'
          : 'Element rad etildi',
      data: this.formatModerationItem(populatedItem),
    };
  }

  /**
   * Moderatsiya statistikasini olish
   */
  async getModerationStats() {
    const [pending, approved, rejected, total] = await Promise.all([
      this.moderationModel.countDocuments({ status: ModerationStatus.PENDING }),
      this.moderationModel.countDocuments({
        status: ModerationStatus.APPROVED,
      }),
      this.moderationModel.countDocuments({
        status: ModerationStatus.REJECTED,
      }),
      this.moderationModel.countDocuments(),
    ]);

    return {
      success: true,
      message: 'Statistika yuklandi',
      data: {
        pending,
        approved,
        rejected,
        total,
      },
    };
  }

  /**
   * Yangi moderatsiya elementi yaratish (analiz natijasidan keyin chaqiriladi)
   */
  async createModerationItem(data: {
    content: string;
    toxicityLevel: ToxicityLevel;
    toxicityScore: number;
    submittedBy: string;
  }) {
    const moderationItem = new this.moderationModel({
      content: data.content,
      toxicityLevel: data.toxicityLevel,
      toxicityScore: data.toxicityScore,
      submittedBy: new Types.ObjectId(data.submittedBy),
      status: ModerationStatus.PENDING,
      submittedAt: new Date(),
    });

    return await moderationItem.save();
  }

  /**
   * Moderatsiya elementini o'chirish
   */
  async deleteItem(itemId: string) {
    if (!Types.ObjectId.isValid(itemId)) {
      throw new BadRequestException("Noto'g'ri ID formati");
    }

    const item = await this.moderationModel.findById(itemId);

    if (!item) {
      throw new NotFoundException('Element topilmadi');
    }

    await this.moderationModel.findByIdAndDelete(itemId);

    return {
      success: true,
      message: "Element o'chirildi",
    };
  }

  /**
   * Moderatsiya elementini formatlash
   */
  private formatModerationItem(item: any) {
    return {
      id: item._id.toString(),
      content: item.content,
      toxicityLevel: item.toxicityLevel,
      toxicityScore: item.toxicityScore,
      status: item.status,
      submittedBy:
        item.submittedBy?.name || item.submittedBy?.email || 'Unknown',
      submittedAt: item.submittedAt,
      reviewedBy: item.reviewedBy
        ? item.reviewedBy.name || item.reviewedBy.email
        : undefined,
      reviewedAt: item.reviewedAt,
      reviewNotes: item.reviewNotes,
    };
  }
}
