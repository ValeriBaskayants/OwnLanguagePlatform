import { Document } from 'mongoose';
export type ListeningDocument = Listening & Document;
export declare class Listening {
    text: string;
    level: string;
    topic: string;
    difficulty: string;
    type: string;
    questions: Array<{
        question: string;
        options: string[];
        correctIndex: number;
    }>;
}
export declare const ListeningSchema: any;
