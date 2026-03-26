import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email manzili',
    example: 'shamshod@example.com',
  })
  @IsNotEmpty({ message: 'Email kiritilishi shart' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  email: string;

  @ApiProperty({
    description: 'Parol',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @IsString({ message: "Parol matn bo'lishi kerak" })
  password: string;
}
