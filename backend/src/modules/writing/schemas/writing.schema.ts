import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WritingPromptDocument = WritingPrompt & Document;
export type WritingSubmissionDocument = WritingSubmission & Document;

@Schema({ timestamps: true })
export class WritingPrompt {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  level: string;

  @Prop({ enum: ['sentence', 'paragraph', 'essay'], default: 'paragraph' })
  type: string;

  @Prop({ default: 50 })
  minWords: number;

  @Prop({ default: 200 })
  maxWords: number;

  @Prop({ default: '' })
  topic: string;

  @Prop({ default: '' })
  instructions: string;
}

export const WritingPromptSchema = SchemaFactory.createForClass(WritingPrompt);
WritingPromptSchema.index({ level: 1 });

@Schema({ timestamps: true })
export class WritingSubmission {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WritingPrompt', required: true })
  promptId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: {
      overallScore: Number,
      grammarScore: Number,
      taskScore: Number,
      coherenceScore: Number,
      wordCount: Number,
      errorCount: Number,
      errors: [
        {
          message: String,
          context: String,
          offset: Number,
          length: Number,
          replacements: [String],
        },
      ],
    },
    default: null,
  })
  analysis: {
    overallScore: number;
    grammarScore: number;
    taskScore: number;
    coherenceScore: number;
    wordCount: number;
    errorCount: number;
    errors: Array<{
      message: string;
      context: string;
      offset: number;
      length: number;
      replacements: string[];
    }>;
  } | null;

  @Prop({ enum: ['pending', 'analyzed', 'error'], default: 'pending' })
  status: string;

  @Prop({ default: () => new Date() })
  submittedAt: Date;
}

export const WritingSubmissionSchema = SchemaFactory.createForClass(WritingSubmission);
WritingSubmissionSchema.index({ userId: 1, promptId: 1 });
