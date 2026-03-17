import { LevelTestService } from './level-test.service';
export declare class LevelTestController {
    private service;
    constructor(service: LevelTestService);
    getQuestions(req: any): unknown;
    submit(req: any, body: any): unknown;
}
