import { MistakesService } from './mistakes.service';
export declare class MistakesController {
    private service;
    constructor(service: MistakesService);
    findAll(req: any, itemType: string): unknown;
    getWeakSpots(req: any): unknown;
}
