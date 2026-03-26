import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: "Yangi user ro'yxatdan o'tkazish",
    description:
      'Yangi foydalanuvchi yaratadi. Default role: "user". Admin roli faqat database tomondan o\'zgartiriladi.',
  })
  @ApiResponse({
    status: 201,
    description:
      "Ro'yxatdan o'tish muvaffaqiyatli. User ma'lumotlari va JWT token qaytariladi.",
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validatsiya xatosi' })
  @ApiConflictResponse({ description: 'Email allaqachon mavjud' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tizimga kirish',
    description:
      "Mavjud foydalanuvchi tizimga kiradi va JWT token oladi. Response'da user roli ham qaytariladi.",
  })
  @ApiResponse({
    status: 200,
    description:
      "Tizimga kirish muvaffaqiyatli. User ma'lumotlari (role bilan) va JWT token qaytariladi.",
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validatsiya xatosi' })
  @ApiUnauthorizedResponse({ description: "Email yoki parol noto'g'ri" })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
