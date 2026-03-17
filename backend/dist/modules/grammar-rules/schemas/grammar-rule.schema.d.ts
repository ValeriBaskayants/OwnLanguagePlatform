import { Document } from 'mongoose';
export type GrammarRuleDocument = GrammarRule & Document;
export declare class GrammarRule {
    topic: string;
    slug: string;
    level: string;
    summary: string;
    coreConcept: string;
    structure: string;
    usages: Array<{
        title: string;
        explanation: string;
        examples: Array<{
            sentence: string;
            translation?: string;
        }>;
    }>;
    sections: Array<{
        title: string;
        content: string;
        examples: Array<{
            sentence: string;
            translation?: string;
        }>;
    }>;
    comparisons: Array<{
        compareWith: string;
        explanation: string;
        examples: Array<{
            sentence: string;
            translation?: string;
        }>;
    }>;
    commonMistakes: string[];
    signalWords: string[];
    relatedTopics: string[];
}
export declare const GrammarRuleSchema: any;
