import {
  Controller,
  Get,
  Patch,
  Delete,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Admin dashboard ma'lumotlarini olish
   * GET /admin/dashboard
   */
  @Get('dashboard')
  async getDashboard() {
    const data = await this.adminService.getDashboard();
    return {
      success: true,
      message: "Dashboard ma'lumotlari yuklandi",
      data,
    };
  }

  /**
   * Barcha foydalanuvchilar ro'yxatini olish
   * GET /admin/users?page=1&pageSize=10&search=shamshod&role=user
   */
  @Get('users')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    const data = await this.adminService.getAllUsers({
      page: Number(page),
      pageSize: Number(pageSize),
      search,
      role,
    });
    return {
      success: true,
      message: 'Foydalanuvchilar yuklandi',
      data,
    };
  }

  /**
   * Foydalanuvchi rolini o'zgartirish
   * PATCH /admin/users/:userId/role
   */
  @Patch('users/:userId/role')
  async updateUserRole(
    @Param('userId') userId: string,
    @Body('role') role: string,
  ) {
    const data = await this.adminService.updateUserRole(userId, role);
    return {
      success: true,
      message: "Foydalanuvchi roli o'zgartirildi",
      data,
    };
  }

  /**
   * Foydalanuvchini bloklash/blokdan chiqarish
   * PATCH /admin/users/:userId/block
   */
  @Patch('users/:userId/block')
  async toggleUserBlock(
    @Param('userId') userId: string,
    @Body('blocked') blocked: boolean,
  ) {
    const data = await this.adminService.toggleUserBlock(userId, blocked);
    return {
      success: true,
      message: blocked
        ? 'Foydalanuvchi bloklandi'
        : 'Foydalanuvchi blokdan chiqarildi',
      data,
    };
  }

  /**
   * Foydalanuvchini o'chirish
   * DELETE /admin/users/:userId
   */
  @Delete('users/:userId')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('userId') userId: string) {
    await this.adminService.deleteUser(userId);
    return {
      success: true,
      message: "Foydalanuvchi o'chirildi",
    };
  }

  /**
   * Tizim sozlamalarini olish
   * GET /admin/settings
   */
  @Get('settings')
  async getSystemSettings() {
    const data = await this.adminService.getSystemSettings();
    return {
      success: true,
      message: 'Sozlamalar yuklandi',
      data,
    };
  }

  /**
   * Tizim sozlamalarini yangilash
   * PUT /admin/settings
   */
  @Put('settings')
  async updateSystemSettings(@Body() settings: any) {
    const data = await this.adminService.updateSystemSettings(settings);
    return {
      success: true,
      message: 'Sozlamalar saqlandi',
      data,
    };
  }

  /**
   * Haftalik statistika
   * GET /admin/weekly-statistics?days=7
   * GET /admin/weekly-statistics?days=30
   */
  @Get('weekly-statistics')
  async getWeeklyStatistics(@Query('days') days: number = 7) {
    const data = await this.adminService.getWeeklyStatistics(Number(days));
    return {
      success: true,
      message: 'Statistika yuklandi',
      data,
    };
  }

  /**
   * So'nggi xavfli matnlar
   * GET /admin/recent-dangerous?limit=10
   */
  @Get('recent-dangerous')
  async getRecentDangerousContent(@Query('limit') limit: number = 10) {
    const data = await this.adminService.getRecentDangerousContent(
      Number(limit),
    );
    return {
      success: true,
      message: "So'nggi xavfli matnlar yuklandi",
      data,
    };
  }
}
