import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateAnalysisDto {
  @ApiProperty({
    description: 'Tahlil qilinadigan matn',
    example: 'Bu juda yaxshi fikr ekan!',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty({ message: 'Matn kiritilishi shart' })
  @MaxLength(5000, { message: 'Matn 5000 belgidan oshmasligi kerak' })
  text: string;

  @ApiPropertyOptional({
    description: 'Foydalanuvchi ID si (optional)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
