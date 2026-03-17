import { Model } from 'mongoose';
import { SessionDocument } from './schemas/session.schema';
import { MistakeDocument } from '../mistakes/schemas/mistake.schema';
import { ProgressService } from '../progress/progress.service';
export declare class SessionsService {
    private sessionModel;
    private mistakeModel;
    private progressService;
    constructor(sessionModel: Model<SessionDocument>, mistakeModel: Model<MistakeDocument>, progressService: ProgressService);
    createSession(userId: string, body: {
        type: string;
        level: string;
        answers: Array<{
            itemId: string;
            userAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
            timeSpentMs: number;
            topic?: string;
            difficulty?: string;
        }>;
        durationMs: number;
        writingScore?: number;
        vocabLearned?: number;
    }): unknown;
    getHistory(userId: string): unknown;
}
