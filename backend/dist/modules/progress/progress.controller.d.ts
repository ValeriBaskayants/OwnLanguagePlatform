import { ProgressService } from './progress.service';
export declare class ProgressController {
    private service;
    constructor(service: ProgressService);
    getProgress(req: any): unknown;
    getDashboard(req: any): unknown;
    getStreak(req: any): unknown;
}
