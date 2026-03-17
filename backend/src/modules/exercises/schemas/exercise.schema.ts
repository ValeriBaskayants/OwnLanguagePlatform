import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true })
  topic: string;

  @Prop({ required: true })
  level: string;

  @Prop({ enum: ['easy', 'medium', 'hard'], default: 'easy' })
  difficulty: string;

  @Prop({ required: true, unique: true })
  sentence: string;

  @Prop({
    type: [{ position: Number, answer: String, hint: String }],
    required: true,
  })
  blanks: Array<{ position: number; answer: string; hint?: string }>;

  @Prop({ default: '' })
  explanation: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
ExerciseSchema.index({ level: 1, difficulty: 1 });
ExerciseSchema.index({ topic: 1 });
