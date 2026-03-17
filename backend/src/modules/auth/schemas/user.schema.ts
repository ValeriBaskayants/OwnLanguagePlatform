import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export const LEVELS = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C2'];

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: 'A1', enum: LEVELS })
  currentLevel: string;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ default: 0 })
  streak: number;

  @Prop({ default: null })
  lastActivityDate: Date;

  @Prop({
    type: {
      grammarCompleted: { type: Number, default: 0 },
      grammarAccuracy: { type: Number, default: 0 },
      vocabularyLearned: { type: Number, default: 0 },
      readingCompleted: { type: Number, default: 0 },
      writingSubmitted: { type: Number, default: 0 },
      listeningCompleted: { type: Number, default: 0 },
      quizCompleted: { type: Number, default: 0 },
      totalSessionTime: { type: Number, default: 0 },
    },
    default: {},
  })
  stats: {
    grammarCompleted: number;
    grammarAccuracy: number;
    vocabularyLearned: number;
    readingCompleted: number;
    writingSubmitted: number;
    listeningCompleted: number;
    quizCompleted: number;
    totalSessionTime: number;
  };

  @Prop({
    type: [
      {
        level: String,
        attemptNumber: Number,
        score: Number,
        passed: Boolean,
        takenAt: Date,
        breakdown: {
          grammar: Number,
          vocabulary: Number,
          reading: Number,
          listening: Number,
        },
      },
    ],
    default: [],
  })
  levelTests: Array<{
    level: string;
    attemptNumber: number;
    score: number;
    passed: boolean;
    takenAt: Date;
    breakdown: { grammar: number; vocabulary: number; reading: number; listening: number };
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
