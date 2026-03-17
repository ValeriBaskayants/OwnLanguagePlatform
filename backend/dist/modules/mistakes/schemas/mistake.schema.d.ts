import { Document, Schema as MongooseSchema } from 'mongoose';
export type MistakeDocument = Mistake & Document;
export declare class Mistake {
    userId: MongooseSchema.Types.ObjectId;
    itemId: MongooseSchema.Types.ObjectId;
    itemType: string;
    topic: string;
    level: string;
    difficulty: string;
    wrongAnswers: Array<{
        userAnswer: string;
        correctAnswer: string;
        occurredAt: Date;
    }>;
    occurrenceCount: number;
    lastAttemptAt: Date;
}
export declare const MistakeSchema: any;
