import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MistakeDocument = Mistake & Document;

@Schema({ timestamps: true })
export class Mistake {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  itemId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ['grammar', 'quiz', 'vocabulary', 'listening'], required: true })
  itemType: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  level: string;

  @Prop({ default: 'easy' })
  difficulty: string;

  @Prop({
    type: [{ userAnswer: String, correctAnswer: String, occurredAt: Date }],
    default: [],
  })
  wrongAnswers: Array<{ userAnswer: string; correctAnswer: string; occurredAt: Date }>;

  @Prop({ default: 1 })
  occurrenceCount: number;

  @Prop({ default: () => new Date() })
  lastAttemptAt: Date;
}

export const MistakeSchema = SchemaFactory.createForClass(Mistake);
MistakeSchema.index({ userId: 1, itemId: 1 }, { unique: true });
MistakeSchema.index({ userId: 1, topic: 1 });
