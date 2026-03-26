import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { QueryAnalysisDto } from './dto/query-analysis.dto';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  /**
   * POST /api/analysis/check - Matnni tahlil qilish
   */
  @Post('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Matnni tahlil qilish',
    description:
      'Berilgan matnni toksiklik uchun tahlil qiladi va natijani saqlaydi. Faqat login qilgan foydalanuvchilar uchun.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tahlil muvaffaqiyatli bajarildi',
    schema: {
      example: {
        success: true,
        message: 'Tahlil muvaffaqiyatli bajarildi',
        data: {
          id: '507f1f77bcf86cd799439011',
          originalText: 'Bu juda yaxshi fikr ekan!',
          toxicityLevel: 'xavfsiz',
          toxicityScore: 5.2,
          detectedWords: [],
          timestamp: '2024-03-26T10:30:00.000Z',
          userId: 'user-uuid-123',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 400,
    description: 'Matn kiritilmagan yoki juda uzun',
    schema: {
      example: {
        success: false,
        message: 'Matn kiritilishi shart',
        error: 'INVALID_INPUT',
      },
    },
  })
  async analyzeText(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @Request() req,
  ) {
    // JWT guard orqali req.user avtomatik to'ldiriladi
    const userId = req.user._id.toString();

    const data = await this.analysisService.analyzeText({
      ...createAnalysisDto,
      userId,
    });

    return {
      success: true,
      message: 'Tahlil muvaffaqiyatli bajarildi',
      data,
    };
  }

  /**
   * GET /api/analysis/history - Foydalanuvchi tarixini olish
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tahlil tarixini olish',
    description:
      "Foydalanuvchining o'z tahlil tarixini sahifalash bilan qaytaradi. Faqat o'z tahlillarini ko'radi.",
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
  @ApiResponse({
    status: 200,
    description: 'Tarix muvaffaqiyatli yuklandi',
    schema: {
      example: {
        success: true,
        message: 'Tarix muvaffaqiyatli yuklandi',
        data: {
          results: [
            {
              id: '507f1f77bcf86cd799439011',
              text: 'Bu juda yaxshi fikr ekan!',
              toxicityLevel: 'xavfsiz',
              toxicityScore: 5.2,
              analyzedAt: '2024-03-26T10:30:00.000Z',
              detectedWords: [],
            },
          ],
          total: 150,
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
  async getUserHistory(@Request() req, @Query() queryDto: QueryAnalysisDto) {
    // JWT guard orqali req.user avtomatik to'ldiriladi
    const userId = req.user._id.toString();

    const data = await this.analysisService.getUserHistory(userId, queryDto);

    return {
      success: true,
      message: 'Tarix muvaffaqiyatli yuklandi',
      data,
    };
  }

  /**
   * GET /api/analysis/:id - Tahlilni ID bo'yicha olish
   */
  @Get(':id')
  @ApiOperation({
    summary: "Tahlilni ID bo'yicha olish",
    description: "Berilgan ID bo'yicha tahlil natijasini qaytaradi",
  })
  @ApiParam({
    name: 'id',
    description: 'Tahlil ID si (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Tahlil muvaffaqiyatli topildi',
    schema: {
      example: {
        success: true,
        message: 'Tahlil muvaffaqiyatli topildi',
        data: {
          id: '507f1f77bcf86cd799439011',
          originalText: 'Bu juda yaxshi fikr ekan!',
          toxicityLevel: 'xavfsiz',
          toxicityScore: 5.2,
          detectedWords: [],
          timestamp: '2024-03-26T10:30:00.000Z',
          userId: 'user-uuid-123',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tahlil topilmadi',
  })
  async getAnalysisById(@Param('id') id: string) {
    const data = await this.analysisService.getAnalysisById(id);

    return {
      success: true,
      message: 'Tahlil muvaffaqiyatli topildi',
      data,
    };
  }

  /**
   * DELETE /api/analysis/:id - Tahlilni o'chirish
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Tahlilni o'chirish",
    description: "Foydalanuvchi faqat o'z tahlilini o'chirishi mumkin",
  })
  @ApiParam({
    name: 'id',
    description: "O'chiriladigan tahlil ID si",
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: "Tahlil muvaffaqiyatli o'chirildi",
    schema: {
      example: {
        success: true,
        message: "Tahlil muvaffaqiyatli o'chirildi",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Autentifikatsiya talab qilinadi',
  })
  @ApiResponse({
    status: 403,
    description: "Sizda bu tahlilni o'chirish huquqi yo'q",
  })
  @ApiResponse({
    status: 404,
    description: 'Tahlil topilmadi',
  })
  async deleteAnalysis(@Param('id') id: string, @Request() req) {
    // JWT guard orqali req.user avtomatik to'ldiriladi
    const userId = req.user._id.toString();

    await this.analysisService.deleteAnalysis(id, userId);

    return {
      success: true,
      message: "Tahlil muvaffaqiyatli o'chirildi",
    };
  }
}
