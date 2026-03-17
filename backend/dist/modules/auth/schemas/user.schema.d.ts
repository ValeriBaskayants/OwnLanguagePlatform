import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare const LEVELS: {};
export declare class User {
    email: string;
    password: string;
    role: string;
    currentLevel: string;
    xp: number;
    streak: number;
    lastActivityDate: Date;
    stats: {
        grammarCompleted: number;
        grammarAccuracy: number;
        vocabularyLearned: number;
        readingCompleted: number;
        writingSubmitted: number;
        listeningCompleted: number;
        quizCompleted: number;
        totalSessionTime: number;
    };
    levelTests: Array<{
        level: string;
        attemptNumber: number;
        score: number;
        passed: boolean;
        takenAt: Date;
        breakdown: {
            grammar: number;
            vocabulary: number;
            reading: number;
            listening: number;
        };
    }>;
}
export declare const UserSchema: any;
