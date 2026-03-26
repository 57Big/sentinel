import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Email allaqachon mavjudligini tekshirish
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Bu email allaqachon ro'yxatdan o'tgan");
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yangi user yaratish
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    // JWT token yaratish
    const token = this.generateToken(user._id.toString());

    // Parolsiz user ma'lumotlarini qaytarish
    return {
      success: true,
      message: "Ro'yxatdan o'tish muvaffaqiyatli",
      data: {
        token,
        user: this.usersService.getUserWithoutPassword(user),
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Userning mavjudligini tekshirish
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    // Parolni tekshirish
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    // JWT token yaratish
    const token = this.generateToken(user._id.toString());

    // Parolsiz user ma'lumotlarini qaytarish
    return {
      success: true,
      token,
      user: this.usersService.getUserWithoutPassword(user),
    };
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ id: userId });
  }

  async validateUser(userId: string) {
    return await this.usersService.findById(userId);
  }
}
