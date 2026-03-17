import { Document, Schema as MongooseSchema } from 'mongoose';
export type LevelProgressDocument = LevelProgress & Document;
export declare class LevelProgress {
    userId: MongooseSchema.Types.ObjectId;
    level: string;
    targetLevel: string;
    requirements: {
        grammar: {
            required: number;
            completed: number;
            accuracy: number;
        };
        vocabulary: {
            required: number;
            learned: number;
        };
        reading: {
            required: number;
            completed: number;
            accuracy: number;
        };
        writing: {
            required: number;
            completed: number;
            avgScore: number;
        };
        listening: {
            required: number;
            completed: number;
            accuracy: number;
        };
        quiz: {
            required: number;
            completed: number;
            accuracy: number;
        };
    };
    isReadyForTest: boolean;
    testUnlockedAt: Date;
}
export declare const LevelProgressSchema: any;
