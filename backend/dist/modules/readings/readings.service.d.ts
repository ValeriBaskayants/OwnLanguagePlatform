import { Model } from 'mongoose';
import { ReadingDocument } from './schemas/reading.schema';
export declare class ReadingsService {
    private model;
    constructor(model: Model<ReadingDocument>);
    findAll(level?: string, topic?: string): unknown;
    findById(id: string): unknown;
    bulkCreate(readings: any[]): unknown;
}
