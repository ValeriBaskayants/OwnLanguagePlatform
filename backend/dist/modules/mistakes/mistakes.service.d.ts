import { Model } from 'mongoose';
import { MistakeDocument } from './schemas/mistake.schema';
export declare class MistakesService {
    private model;
    constructor(model: Model<MistakeDocument>);
    findAll(userId: string, itemType?: string): unknown;
    getWeakSpots(userId: string): unknown;
}
