import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelProgress, LevelProgressSchema } from './schemas/level-progress.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { DailyActivity, DailyActivitySchema } from '../daily-activity/schemas/daily-activity.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LevelProgress.name, schema: LevelProgressSchema },
      { name: User.name, schema: UserSchema },
      { name: DailyActivity.name, schema: DailyActivitySchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
