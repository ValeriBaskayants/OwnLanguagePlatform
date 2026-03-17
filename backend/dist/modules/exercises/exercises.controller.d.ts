import { ExercisesService } from './exercises.service';
export declare class ExercisesController {
    private service;
    constructor(service: ExercisesService);
    findAll(q: any): unknown;
    getTopics(level: string): unknown;
}
