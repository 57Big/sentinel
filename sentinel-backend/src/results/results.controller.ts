import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { ResultsService } from './results.service';
import { QueryResultsDto } from './dto/query-results.dto';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  /**
   * GET /api/results/all - Barcha natijalarni olish (faqat admin uchun)
   */
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Barcha tahlil natijalarini olish (faqat admin)',
    description:
      'Tizimda mavjud barcha tahlil natijalarini sahifalash bilan qaytaradi. Faqat admin foydalanuvchilar uchun.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'analyzedAt',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Barcha natijalar muvaffaqiyatli yuklandi',
    schema: {
      example: {
        success: true,
        message: 'Barcha natijalar muvaffaqiyatli yuklandi',
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
          total: 1500,
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
    description: "Ruxsat yo'q - faqat admin foydalanuvchilar",
  })
  async getAllResults(@Query() queryDto: QueryResultsDto) {
    const data = await this.resultsService.getAllResults(queryDto);

    return {
      success: true,
      message: 'Barcha natijalar muvaffaqiyatli yuklandi',
      data,
    };
  }

  /**
   * GET /api/results/list - Foydalanuvchining o'z natijalarini olish
   */
  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Foydalanuvchining o'z tahlil natijalarini olish",
    description:
      "Login qilgan foydalanuvchining o'z tahlil natijalarini sahifalash bilan qaytaradi. Autentifikatsiya talab qilinadi.",
  })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'analyzedAt',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Natijalar muvaffaqiyatli yuklandi',
    schema: {
      example: {
        success: true,
        message: 'Natijalar muvaffaqiyatli yuklandi',
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
  async getResults(@Request() req, @Query() queryDto: QueryResultsDto) {
    // JWT guard orqali req.user avtomatik to'ldiriladi
    const userId = req.user._id.toString();

    // Faqat o'z natijalarini olish
    const data = await this.resultsService.getUserResults(userId, queryDto);

    return {
      success: true,
      message: 'Natijalar muvaffaqiyatli yuklandi',
      data,
    };
  }

  /**
   * GET /api/results/user/:userId - Foydalanuvchi natijalarini olish
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Foydalanuvchi natijalarini olish',
    description:
      'Berilgan foydalanuvchining tahlil natijalarini sahifalash bilan qaytaradi. Faqat login qilgan foydalanuvchilar uchun.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    example: 'analyzedAt',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi natijalari yuklandi',
    schema: {
      example: {
        success: true,
        message: 'Foydalanuvchi natijalari yuklandi',
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
  async getUserResults(@Request() req, @Query() queryDto: QueryResultsDto) {
    // JWT guard orqali req.user avtomatik to'ldiriladi
    const userId = req.user._id.toString();

    const data = await this.resultsService.getUserResults(userId, queryDto);

    return {
      success: true,
      message: 'Foydalanuvchi natijalari yuklandi',
      data,
    };
  }
}
