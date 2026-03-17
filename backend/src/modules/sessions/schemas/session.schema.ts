import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ['grammar', 'quiz', 'flashcard', 'reading', 'writing', 'listening', 'level_test'], required: true })
  type: string;

  @Prop({ required: true })
  level: string;

  @Prop({
    type: [
      {
        itemId: MongooseSchema.Types.ObjectId,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        timeSpentMs: Number,
      },
    ],
    default: [],
  })
  answers: Array<{
    itemId: MongooseSchema.Types.ObjectId;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpentMs: number;
  }>;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  totalItems: number;

  @Prop({ default: 0 })
  correctCount: number;

  @Prop({ default: 0 })
  xpEarned: number;

  @Prop({ default: 0 })
  durationMs: number;

  @Prop({ default: () => new Date() })
  startedAt: Date;

  @Prop({ default: null })
  completedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.index({ userId: 1, type: 1 });
SessionSchema.index({ userId: 1, startedAt: -1 });
