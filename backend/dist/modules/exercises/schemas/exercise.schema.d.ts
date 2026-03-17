import { Document } from 'mongoose';
export type ExerciseDocument = Exercise & Document;
export declare class Exercise {
    topic: string;
    level: string;
    difficulty: string;
    sentence: string;
    blanks: Array<{
        position: number;
        answer: string;
        hint?: string;
    }>;
    explanation: string;
    tags: string[];
}
export declare const ExerciseSchema: any;
