import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListeningDocument = Listening & Document;

@Schema({ timestamps: true })
export class Listening {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  topic: string;

  @Prop({ enum: ['easy', 'medium', 'hard'], default: 'easy' })
  difficulty: string;

  @Prop({ enum: ['dictation', 'comprehension'], required: true })
  type: string;

  @Prop({
    type: [{ question: String, options: [String], correctIndex: Number }],
    default: [],
  })
  questions: Array<{ question: string; options: string[]; correctIndex: number }>;
}

export const ListeningSchema = SchemaFactory.createForClass(Listening);
ListeningSchema.index({ level: 1, type: 1 });
