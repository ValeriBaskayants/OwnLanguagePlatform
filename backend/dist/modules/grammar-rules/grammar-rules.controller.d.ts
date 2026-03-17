import { GrammarRulesService } from './grammar-rules.service';
export declare class GrammarRulesController {
    private service;
    constructor(service: GrammarRulesService);
    findAll(level: string): unknown;
    findBySlug(slug: string): unknown;
}
