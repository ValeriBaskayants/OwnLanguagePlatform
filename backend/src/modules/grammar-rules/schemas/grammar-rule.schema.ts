import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GrammarRuleDocument = GrammarRule & Document;

@Schema({ timestamps: true })
export class GrammarRule {
  @Prop({ required: true })
  topic: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  level: string;

  @Prop({ default: '' })
  summary: string;

  @Prop({ default: '' })
  coreConcept: string;

  @Prop({ default: '' })
  structure: string;

  @Prop({
    type: [{
      title: String,
      explanation: String,
      examples: [{ sentence: String, translation: String }],
    }],
    default: [],
  })
  usages: Array<{
    title: string;
    explanation: string;
    examples: Array<{ sentence: string; translation?: string }>;
  }>;

  @Prop({
    type: [{
      title: String,
      content: String,
      examples: [{ sentence: String, translation: String }],
    }],
    default: [],
  })
  sections: Array<{
    title: string;
    content: string;
    examples: Array<{ sentence: string; translation?: string }>;
  }>;

  @Prop({
    type: [{
      compareWith: String,
      explanation: String,
      examples: [{ sentence: String, translation: String }],
    }],
    default: [],
  })
  comparisons: Array<{
    compareWith: string;
    explanation: string;
    examples: Array<{ sentence: string; translation?: string }>;
  }>;

  @Prop({ type: [String], default: [] })
  commonMistakes: string[];

  @Prop({ type: [String], default: [] })
  signalWords: string[];

  @Prop({ type: [String], default: [] })
  relatedTopics: string[];
}

export const GrammarRuleSchema = SchemaFactory.createForClass(GrammarRule);
GrammarRuleSchema.index({ level: 1 });