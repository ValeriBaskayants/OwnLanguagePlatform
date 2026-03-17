import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DailyActivityDocument = DailyActivity & Document;

@Schema({ timestamps: true })
export class DailyActivity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  date: string; // 'YYYY-MM-DD'

  @Prop({ default: 0 })
  xpEarned: number;

  @Prop({ default: 0 })
  sessionsCount: number;

  @Prop({ default: 0 })
  minutesSpent: number;
}

export const DailyActivitySchema = SchemaFactory.createForClass(DailyActivity);
DailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });
