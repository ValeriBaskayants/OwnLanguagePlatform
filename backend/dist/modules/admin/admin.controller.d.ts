import { AdminService } from './admin.service';
export declare class AdminController {
    private service;
    constructor(service: AdminService);
    private checkAdmin;
    importExercises(body: any, req: any): unknown;
    importGrammarRules(body: any, req: any): unknown;
    importVocabulary(body: any, req: any): unknown;
    importReadings(body: any, req: any): unknown;
    importMC(body: any, req: any): unknown;
    importWriting(body: any, req: any): unknown;
    importListening(body: any, req: any): unknown;
    getStats(req: any): unknown;
}
