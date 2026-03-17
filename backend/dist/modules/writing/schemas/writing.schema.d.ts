import { Document, Schema as MongooseSchema } from 'mongoose';
export type WritingPromptDocument = WritingPrompt & Document;
export type WritingSubmissionDocument = WritingSubmission & Document;
export declare class WritingPrompt {
    prompt: string;
    level: string;
    type: string;
    minWords: number;
    maxWords: number;
    topic: string;
    instructions: string;
}
export declare const WritingPromptSchema: any;
export declare class WritingSubmission {
    userId: MongooseSchema.Types.ObjectId;
    promptId: MongooseSchema.Types.ObjectId;
    text: string;
    analysis: {
        overallScore: number;
        grammarScore: number;
        taskScore: number;
        coherenceScore: number;
        wordCount: number;
        errorCount: number;
        errors: Array<{
            message: string;
            context: string;
            offset: number;
            length: number;
            replacements: string[];
        }>;
    } | null;
    status: string;
    submittedAt: Date;
}
export declare const WritingSubmissionSchema: any;
