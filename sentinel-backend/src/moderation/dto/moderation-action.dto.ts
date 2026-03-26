import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ModerationAction {
  APPROVE = 'approve',
  REJECT = 'reject',
}

export class ModerationActionDto {
  @IsString()
  itemId: string;

  @IsEnum(ModerationAction)
  action: ModerationAction;

  @IsOptional()
  @IsString()
  notes?: string;
}
