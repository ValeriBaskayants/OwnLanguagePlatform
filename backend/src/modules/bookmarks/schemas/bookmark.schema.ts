import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookmarkDocument = Bookmark & Document;

@Schema({ timestamps: true })
export class Bookmark {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  itemId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ['grammar_rule', 'vocabulary', 'reading', 'writing_prompt'], required: true })
  itemType: string;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
BookmarkSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });
