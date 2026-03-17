import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MultipleChoiceDocument = MultipleChoice & Document;

@Schema({ timestamps: true })
export class MultipleChoice {
  @Prop({ required: true, unique: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctIndex: number;

  @Prop({ default: '' })
  explanation: string;

  @Prop({ default: '' })
  topic: string;

  @Prop({ required: true })
  level: string;

  @Prop({ enum: ['easy', 'medium', 'hard'], default: 'easy' })
  difficulty: string;
}

export const MultipleChoiceSchema = SchemaFactory.createForClass(MultipleChoice);
MultipleChoiceSchema.index({ level: 1, difficulty: 1 });
