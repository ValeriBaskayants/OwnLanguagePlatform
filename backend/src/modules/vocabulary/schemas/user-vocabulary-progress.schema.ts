import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserVocabularyProgressDocument = UserVocabularyProgress & Document;

@Schema({ timestamps: true })
export class UserVocabularyProgress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vocabulary', required: true })
  wordId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 2.5 })
  easinessFactor: number;

  @Prop({ default: 1 })
  interval: number;

  @Prop({ default: 0 })
  repetitions: number;

  @Prop({ default: () => new Date() })
  nextReviewDate: Date;

  @Prop({ enum: ['new', 'learning', 'review', 'mastered'], default: 'new' })
  status: string;

  @Prop({ default: null })
  lastReviewedAt: Date;
}

export const UserVocabularyProgressSchema = SchemaFactory.createForClass(UserVocabularyProgress);
UserVocabularyProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });
UserVocabularyProgressSchema.index({ userId: 1, nextReviewDate: 1 });
