import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User nomi',
    example: 'Shamshod',
    minLength: 2,
  })
  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @IsString({ message: "Ism matn bo'lishi kerak" })
  @MinLength(2, { message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak" })
  name: string;

  @ApiProperty({
    description: 'Email manzili',
    example: 'shamshod@example.com',
  })
  @IsNotEmpty({ message: 'Email kiritilishi shart' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  email: string;

  @ApiProperty({
    description: 'Parol (minimum 6 ta belgi)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @IsString({ message: "Parol matn bo'lishi kerak" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;
}
