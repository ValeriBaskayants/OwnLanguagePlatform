import { ReadingsService } from './readings.service';
export declare class ReadingsController {
    private service;
    constructor(service: ReadingsService);
    findAll(level: string, topic: string): unknown;
    findById(id: string): unknown;
}
