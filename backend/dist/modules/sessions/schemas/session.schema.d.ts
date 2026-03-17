import { Document, Schema as MongooseSchema } from 'mongoose';
export type SessionDocument = Session & Document;
export declare class Session {
    userId: MongooseSchema.Types.ObjectId;
    type: string;
    level: string;
    answers: Array<{
        itemId: MongooseSchema.Types.ObjectId;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        timeSpentMs: number;
    }>;
    score: number;
    totalItems: number;
    correctCount: number;
    xpEarned: number;
    durationMs: number;
    startedAt: Date;
    completedAt: Date;
}
export declare const SessionSchema: any;
