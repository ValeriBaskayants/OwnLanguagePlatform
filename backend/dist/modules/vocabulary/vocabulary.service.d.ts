import { Model } from 'mongoose';
import { VocabularyDocument } from './schemas/vocabulary.schema';
import { UserVocabularyProgressDocument } from './schemas/user-vocabulary-progress.schema';
export declare class VocabularyService {
    private vocabModel;
    private progressModel;
    constructor(vocabModel: Model<VocabularyDocument>, progressModel: Model<UserVocabularyProgressDocument>);
    findAll(query: {
        level?: string;
        type?: string;
        search?: string;
        limit?: number;
    }): unknown;
    getFlashcards(userId: string, level?: string, limit?: number): unknown;
    reviewWord(userId: string, wordId: string, quality: 0 | 1 | 2 | 3): unknown;
    getUserProgress(userId: string): unknown;
    bulkCreate(words: any[]): unknown;
}
