import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModerationDocument = Moderation &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

export enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ToxicityLevel {
  XAVFSIZ = 'xavfsiz',
  SHUBHALI = 'shubhali',
  TOKSIK = 'toksik',
}

@Schema({ timestamps: true })
export class Moderation {
  @Prop({ required: true })
  content: string;

  @Prop({
    type: String,
    enum: ToxicityLevel,
    required: true,
  })
  toxicityLevel: ToxicityLevel;

  @Prop({
    required: true,
    min: 0,
    max: 100,
  })
  toxicityScore: number;

  @Prop({
    type: String,
    enum: ModerationStatus,
    default: ModerationStatus.PENDING,
  })
  status: ModerationStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  submittedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  reviewedBy?: Types.ObjectId;

  @Prop({ type: Date, required: false })
  reviewedAt?: Date;

  @Prop({ type: String, required: false })
  reviewNotes?: string;

  // timestamps: true avtomatik ravishda createdAt va updatedAt qo'shadi
}

export const ModerationSchema = SchemaFactory.createForClass(Moderation);

// Indexlar
ModerationSchema.index({ status: 1, submittedAt: -1 });
ModerationSchema.index({ submittedBy: 1 });
ModerationSchema.index({ reviewedBy: 1 });
ModerationSchema.index({ toxicityLevel: 1 });
