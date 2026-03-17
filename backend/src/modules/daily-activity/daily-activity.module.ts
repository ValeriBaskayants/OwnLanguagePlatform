import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyActivity, DailyActivitySchema } from './schemas/daily-activity.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DailyActivity.name, schema: DailyActivitySchema }])],
  exports: [MongooseModule],
})
export class DailyActivityModule {}
