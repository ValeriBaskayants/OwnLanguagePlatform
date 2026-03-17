import { Model } from 'mongoose';
import { ExerciseDocument } from './schemas/exercise.schema';
export declare class ExercisesService {
    private model;
    constructor(model: Model<ExerciseDocument>);
    findAll(query: {
        level?: string;
        difficulty?: string;
        topic?: string;
        limit?: number;
    }): unknown;
    getTopics(level?: string): unknown;
    bulkCreate(exercises: any[]): unknown;
}
