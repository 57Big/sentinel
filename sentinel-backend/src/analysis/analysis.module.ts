import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { OpenAIService } from './openai.service';
import { Analysis, AnalysisSchema } from './schemas/analysis.schema';
import { ModerationModule } from '../moderation/moderation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analysis.name, schema: AnalysisSchema },
    ]),
    ConfigModule,
    ModerationModule,
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, OpenAIService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
