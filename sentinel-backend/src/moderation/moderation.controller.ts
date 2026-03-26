import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { ModerationService } from './moderation.service';
import { ModerationActionDto } from './dto/moderation-action.dto';
import { ModerationListDto } from './dto/moderation-list.dto';

@ApiTags('Moderation')
@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  /**
   * GET /api/moderation/list - Moderatsiya ro'yxatini olish
   */
  @Get('list')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Moderatsiya ro'yxatini olish",
    description:
      "Moderatsiya kutilayotgan elementlar ro'yxatini sahifalash va filterlash bilan qaytaradi. Faqat moderator va admin foydalanuvchilar uchun.",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    type: Number,
    description: 'Sahifa raqami',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    example: 10,
    type: Number,
    description: 'Sahifadagi elementlar soni',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    example: 'pending',
    enum: ['pending', 'approved', 'rejected', 'toxic', 'suspicious'],
    description: "Status bo'yicha filterlash",
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'submittedAt',
    type: String,
    description: 'Saralash maydoni',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Saralash tartibi',
  })
  @ApiResponse({
    status: 200,
    description: "Moderatsiya ro'yxati muvaffaqiyatli yuklandi",
    schema: {
      example: {
        success: true,
        message: "Moderatsiya ro'yxati yuklandi",
        data: {
          items: [
            {
              id: '507f1f77bcf86cd799439011',
              content: 'Bu juda yomon gap ekan',
              toxicityLevel: 'toksik',
              toxicityScore: 85.5,
              status: 'pending',
              submittedBy: 'user@example.com',
              submittedAt: '2024-03-26T10:30:00.000Z',
              reviewedBy: null,
              reviewedAt: null,
              reviewNotes: null,
            },
          ],
          total: 50,
          page: 1,
          pageSize: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q - faqat moderator va admin uchun",
  })
  async getModerationList(@Query() queryDto: ModerationListDto) {
    return await this.moderationService.getModerationList(queryDto);
  }

  /**
   * GET /api/moderation/stats - Moderatsiya statistikasini olish
   */
  @Get('stats')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Moderatsiya statistikasini olish',
    description:
      "Moderatsiya elementlari bo'yicha statistika (pending, approved, rejected, total). Faqat moderator va admin foydalanuvchilar uchun.",
  })
  @ApiResponse({
    status: 200,
    description: 'Statistika muvaffaqiyatli yuklandi',
    schema: {
      example: {
        success: true,
        message: 'Statistika yuklandi',
        data: {
          pending: 25,
          approved: 150,
          rejected: 30,
          total: 205,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q - faqat moderator va admin uchun",
  })
  async getModerationStats() {
    return await this.moderationService.getModerationStats();
  }

  /**
   * GET /api/moderation/item/:itemId - Bitta moderatsiya elementini olish
   */
  @Get('item/:itemId')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Moderatsiya elementini ID bo'yicha olish",
    description:
      "Berilgan ID bo'yicha moderatsiya elementini qaytaradi. Faqat moderator va admin foydalanuvchilar uchun.",
  })
  @ApiParam({
    name: 'itemId',
    type: String,
    description: 'Moderatsiya elementi ID si',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Element muvaffaqiyatli topildi',
    schema: {
      example: {
        success: true,
        message: 'Element topildi',
        data: {
          id: '507f1f77bcf86cd799439011',
          content: 'Bu juda yomon gap ekan',
          toxicityLevel: 'toksik',
          toxicityScore: 85.5,
          status: 'pending',
          submittedBy: 'user@example.com',
          submittedAt: '2024-03-26T10:30:00.000Z',
          reviewedBy: null,
          reviewedAt: null,
          reviewNotes: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri ID formati",
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q - faqat moderator va admin uchun",
  })
  @ApiResponse({
    status: 404,
    description: 'Element topilmadi',
  })
  async getModerationItemById(@Param('itemId') itemId: string) {
    return await this.moderationService.getModerationItemById(itemId);
  }

  /**
   * POST /api/moderation/action - Moderatsiya harakatini amalga oshirish
   */
  @Post('action')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Moderatsiya harakatini amalga oshirish',
    description:
      'Moderatsiya elementini tasdiqlash yoki rad etish. Faqat moderator va admin foydalanuvchilar uchun.',
  })
  @ApiResponse({
    status: 200,
    description: 'Moderatsiya muvaffaqiyatli amalga oshirildi',
    schema: {
      example: {
        success: true,
        message: 'Element tasdiqlandi',
        data: {
          id: '507f1f77bcf86cd799439011',
          content: 'Bu juda yomon gap ekan',
          toxicityLevel: 'toksik',
          toxicityScore: 85.5,
          status: 'approved',
          submittedBy: 'user@example.com',
          submittedAt: '2024-03-26T10:30:00.000Z',
          reviewedBy: 'moderator@example.com',
          reviewedAt: '2024-03-26T11:00:00.000Z',
          reviewNotes: 'False positive, tasdiqlandi',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri ma'lumotlar",
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q - faqat moderator va admin uchun",
  })
  @ApiResponse({
    status: 404,
    description: 'Element topilmadi',
  })
  async moderateItem(@Request() req, @Body() actionDto: ModerationActionDto) {
    const userId = req.user._id.toString();
    return await this.moderationService.moderateItem(actionDto, userId);
  }

  /**
   * DELETE /api/moderation/:itemId - Moderatsiya elementini o'chirish
   */
  @Delete(':itemId')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Moderatsiya elementini o'chirish",
    description:
      "Moderatsiya elementini database'dan butunlay o'chirish. Faqat moderator va admin foydalanuvchilar uchun.",
  })
  @ApiParam({
    name: 'itemId',
    type: String,
    description: "O'chiriladigan element ID si",
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: "Element muvaffaqiyatli o'chirildi",
    schema: {
      example: {
        success: true,
        message: "Element o'chirildi",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Noto'g'ri ID formati",
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 403,
    description: "Ruxsat yo'q - faqat moderator va admin uchun",
  })
  @ApiResponse({
    status: 404,
    description: 'Element topilmadi',
  })
  async deleteItem(@Param('itemId') itemId: string) {
    return await this.moderationService.deleteItem(itemId);
  }
}
