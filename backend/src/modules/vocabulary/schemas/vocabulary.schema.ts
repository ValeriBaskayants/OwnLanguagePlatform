import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocabularyDocument = Vocabulary & Document;

@Schema({ timestamps: true })
export class Vocabulary {
  @Prop({ required: true, unique: true })
  word: string;

  @Prop({ required: true })
  level: string;

  @Prop({ enum: ['noun', 'verb', 'adjective', 'adverb', 'phrase'], default: 'noun' })
  type: string;

  @Prop({ default: '' })
  pronunciation: string;

  @Prop({ required: true })
  definition: string;

  @Prop({ default: '' })
  definitionRu: string;

  @Prop({ type: [String], default: [] })
  examples: string[];

  @Prop({ type: [String], default: [] })
  synonyms: string[];

  @Prop({ type: [String], default: [] })
  antonyms: string[];

  @Prop({ default: '' })
  imageUrl: string;

  @Prop({
    type: {
      base: String,
      past: String,
      pastParticiple: String,
      thirdPerson: String,
      presentParticiple: String,
    },
    default: {},
  })
  forms: {
    base?: string;
    past?: string;
    pastParticiple?: string;
    thirdPerson?: string;
    presentParticiple?: string;
  };

  @Prop({ default: false })
  isIrregularVerb: boolean;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
VocabularySchema.index({ level: 1, type: 1 });
VocabularySchema.index({ word: 'text' });
