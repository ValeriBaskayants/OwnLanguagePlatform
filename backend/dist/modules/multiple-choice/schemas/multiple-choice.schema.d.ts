import { Document } from 'mongoose';
export type MultipleChoiceDocument = MultipleChoice & Document;
export declare class MultipleChoice {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    topic: string;
    level: string;
    difficulty: string;
}
export declare const MultipleChoiceSchema: any;
