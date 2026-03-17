import { Document, Schema as MongooseSchema } from 'mongoose';
export type UserVocabularyProgressDocument = UserVocabularyProgress & Document;
export declare class UserVocabularyProgress {
    userId: MongooseSchema.Types.ObjectId;
    wordId: MongooseSchema.Types.ObjectId;
    easinessFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: Date;
    status: string;
    lastReviewedAt: Date;
}
export declare const UserVocabularyProgressSchema: any;
