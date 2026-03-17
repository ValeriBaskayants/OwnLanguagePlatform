import { WritingService } from './writing.service';
export declare class WritingController {
    private service;
    constructor(service: WritingService);
    getPrompts(level: string): unknown;
    getPrompt(id: string): unknown;
    submit(req: any, body: {
        promptId: string;
        text: string;
    }): unknown;
    getSubmissions(req: any, promptId: string): unknown;
    getSubmission(req: any, id: string): unknown;
}
