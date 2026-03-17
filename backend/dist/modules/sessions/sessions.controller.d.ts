import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private service;
    constructor(service: SessionsService);
    create(req: any, body: any): unknown;
    getHistory(req: any): unknown;
}
