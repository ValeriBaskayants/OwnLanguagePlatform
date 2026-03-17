import { Document, Schema as MongooseSchema } from 'mongoose';
export type BookmarkDocument = Bookmark & Document;
export declare class Bookmark {
    userId: MongooseSchema.Types.ObjectId;
    itemId: MongooseSchema.Types.ObjectId;
    itemType: string;
}
export declare const BookmarkSchema: any;
