import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '69c4fcea8b8880c6d5d0332c',
  })
  id: string;

  @ApiProperty({
    description: 'User nomi',
    example: 'Shamshod',
  })
  name: string;

  @ApiProperty({
    description: 'Email manzili',
    example: 'shamshod@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User roli (default: user, faqat DB dan admin qilinadi)',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role: string;

  @ApiProperty({
    description: 'Yaratilgan vaqt',
    example: '2026-03-26T09:31:22.470Z',
  })
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: "So'rov muvaffaqiyatli",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: "User ma'lumotlari",
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
