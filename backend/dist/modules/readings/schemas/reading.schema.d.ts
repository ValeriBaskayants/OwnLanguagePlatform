import { Document } from 'mongoose';
export type ReadingDocument = Reading & Document;
export declare class Reading {
    title: string;
    level: string;
    topic: string;
    content: string;
    wordCount: number;
    estimatedMinutes: number;
    questions: Array<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
        type: string;
    }>;
}
export declare const ReadingSchema: any;
