import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LevelProgressDocument = LevelProgress & Document;

@Schema({ timestamps: true })
export class LevelProgress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  targetLevel: string;

  @Prop({
    type: {
      grammar: {
        required: { type: Number, default: 40 },
        completed: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
      },
      vocabulary: {
        required: { type: Number, default: 50 },
        learned: { type: Number, default: 0 },
      },
      reading: {
        required: { type: Number, default: 5 },
        completed: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
      },
      writing: {
        required: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        avgScore: { type: Number, default: 0 },
      },
      listening: {
        required: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
      },
      quiz: {
        required: { type: Number, default: 20 },
        completed: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
      },
    },
    default: {},
  })
  requirements: {
    grammar: { required: number; completed: number; accuracy: number };
    vocabulary: { required: number; learned: number };
    reading: { required: number; completed: number; accuracy: number };
    writing: { required: number; completed: number; avgScore: number };
    listening: { required: number; completed: number; accuracy: number };
    quiz: { required: number; completed: number; accuracy: number };
  };

  @Prop({ default: false })
  isReadyForTest: boolean;

  @Prop({ default: null })
  testUnlockedAt: Date;
}

export const LevelProgressSchema = SchemaFactory.createForClass(LevelProgress);
LevelProgressSchema.index({ userId: 1, level: 1 }, { unique: true });
