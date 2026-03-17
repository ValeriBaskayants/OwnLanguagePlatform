import { VocabularyService } from './vocabulary.service';
export declare class VocabularyController {
    private service;
    constructor(service: VocabularyService);
    findAll(q: any): unknown;
    getFlashcards(req: any, q: any): unknown;
    getUserProgress(req: any): unknown;
    review(req: any, body: {
        wordId: string;
        quality: 0 | 1 | 2 | 3;
    }): unknown;
}
