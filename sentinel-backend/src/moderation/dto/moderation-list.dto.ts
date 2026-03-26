import { IsOptional, IsNumber, IsEnum, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ModerationFilterStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  TOXIC = 'toxic',
  SUSPICIOUS = 'suspicious',
}

export class ModerationListDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsEnum(ModerationFilterStatus)
  status?: ModerationFilterStatus;

  @IsOptional()
  @IsString()
  sortBy?: string = 'submittedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
