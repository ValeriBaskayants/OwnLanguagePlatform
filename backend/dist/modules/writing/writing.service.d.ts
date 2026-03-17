import { Model } from 'mongoose';
import { WritingPromptDocument, WritingSubmissionDocument } from './schemas/writing.schema';
export declare class WritingService {
    private promptModel;
    private submissionModel;
    constructor(promptModel: Model<WritingPromptDocument>, submissionModel: Model<WritingSubmissionDocument>);
    getPrompts(level?: string): unknown;
    getPromptById(id: string): unknown;
    submit(userId: string, promptId: string, text: string): unknown;
    getSubmission(id: string, userId: string): unknown;
    getSubmissions(userId: string, promptId?: string): unknown;
    bulkCreatePrompts(prompts: any[]): unknown;
}
