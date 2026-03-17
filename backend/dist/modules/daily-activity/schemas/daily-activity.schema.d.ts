import { Document, Schema as MongooseSchema } from 'mongoose';
export type DailyActivityDocument = DailyActivity & Document;
export declare class DailyActivity {
    userId: MongooseSchema.Types.ObjectId;
    date: string;
    xpEarned: number;
    sessionsCount: number;
    minutesSpent: number;
}
export declare const DailyActivitySchema: any;
