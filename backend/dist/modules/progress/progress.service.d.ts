import { Model } from 'mongoose';
import { LevelProgressDocument } from './schemas/level-progress.schema';
import { UserDocument } from '../auth/schemas/user.schema';
import { DailyActivityDocument } from '../daily-activity/schemas/daily-activity.schema';
import { SessionDocument } from '../sessions/schemas/session.schema';
export declare const NEXT_LEVELS: Record<string, string>;
export declare class ProgressService {
    private progressModel;
    private userModel;
    private activityModel;
    private sessionModel;
    constructor(progressModel: Model<LevelProgressDocument>, userModel: Model<UserDocument>, activityModel: Model<DailyActivityDocument>, sessionModel: Model<SessionDocument>);
    getUserProgress(userId: string): unknown;
    getDashboard(userId: string): unknown;
    getStreak(userId: string): unknown;
    updateAfterSession(userId: string, type: string, score: number, correctCount: number, totalItems: number, xpEarned: number, durationMs: number, writingScore?: number, vocabLearned?: number): unknown;
    private updateLevelProgress;
    promoteUser(userId: string, newLevel: string): any;
}
