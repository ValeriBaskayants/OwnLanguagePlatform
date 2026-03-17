import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReadingDocument = Reading & Document;

@Schema({ timestamps: true })
export class Reading {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  wordCount: number;

  @Prop({ default: 3 })
  estimatedMinutes: number;

  @Prop({
    type: [
      {
        question: String,
        options: [String],
        correctIndex: Number,
        explanation: String,
        type: String,
      },
    ],
    default: [],
  })
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    type: string;
  }>;
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);
ReadingSchema.index({ level: 1, topic: 1 });
