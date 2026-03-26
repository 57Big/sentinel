import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Analysis, AnalysisSchema } from '../analysis/schemas/analysis.schema';
import {
  Moderation,
  ModerationSchema,
} from '../moderation/schemas/moderation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Analysis.name, schema: AnalysisSchema },
      { name: Moderation.name, schema: ModerationSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
