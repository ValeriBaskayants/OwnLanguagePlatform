import { Document } from 'mongoose';
export type VocabularyDocument = Vocabulary & Document;
export declare class Vocabulary {
    word: string;
    level: string;
    type: string;
    pronunciation: string;
    definition: string;
    definitionRu: string;
    examples: string[];
    synonyms: string[];
    antonyms: string[];
    imageUrl: string;
    forms: {
        base?: string;
        past?: string;
        pastParticiple?: string;
        thirdPerson?: string;
        presentParticiple?: string;
    };
    isIrregularVerb: boolean;
}
export declare const VocabularySchema: any;
