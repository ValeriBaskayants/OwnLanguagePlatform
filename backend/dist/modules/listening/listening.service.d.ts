import { Model } from 'mongoose';
import { ListeningDocument } from './schemas/listening.schema';
export declare class ListeningService {
    private model;
    constructor(model: Model<ListeningDocument>);
    findAll(query: {
        level?: string;
        type?: string;
        limit?: number;
    }): unknown;
    findRandom(level: string, count: number): unknown;
    bulkCreate(items: any[]): unknown;
}
