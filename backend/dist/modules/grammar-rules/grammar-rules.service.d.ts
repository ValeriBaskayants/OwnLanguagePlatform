import { Model } from 'mongoose';
import { GrammarRuleDocument } from './schemas/grammar-rule.schema';
export declare class GrammarRulesService {
    private model;
    constructor(model: Model<GrammarRuleDocument>);
    findAll(level?: string): unknown;
    findBySlug(slug: string): unknown;
    bulkCreate(rules: any[]): unknown;
}
