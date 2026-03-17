import { Model } from 'mongoose';
import { MultipleChoiceDocument } from './schemas/multiple-choice.schema';
export declare class MultipleChoiceService {
    private model;
    constructor(model: Model<MultipleChoiceDocument>);
    findAll(query: {
        level?: string;
        difficulty?: string;
        limit?: number;
    }): unknown;
    findRandom(level: string, count: number): unknown;
    bulkCreate(items: any[]): unknown;
}
