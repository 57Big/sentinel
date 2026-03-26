import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnalysisDocument = Analysis &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

export enum ToxicityLevel {
  XAVFSIZ = 'xavfsiz',
  SHUBHALI = 'shubhali',
  TOKSIK = 'toksik',
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface DetectedWord {
  word: string;
  position: number;
  severity: Severity;
}

@Schema({ timestamps: true })
export class Analysis {
  @Prop({ required: true })
  originalText: string;

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
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  })
  aggressionScore?: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  })
  offenseScore?: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  })
  threatScore?: number;

  @Prop({ type: [Object], default: [] })
  detectedWords: DetectedWord[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId;

  // timestamps: true avtomatik ravishda createdAt va updatedAt qo'shadi
}

export const AnalysisSchema = SchemaFactory.createForClass(Analysis);

// Indexlar
AnalysisSchema.index({ userId: 1, createdAt: -1 });
AnalysisSchema.index({ toxicityLevel: 1 });
AnalysisSchema.index({ createdAt: -1 });
