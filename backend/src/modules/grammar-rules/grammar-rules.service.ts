import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GrammarRule, GrammarRuleDocument } from './schemas/grammar-rule.schema';

@Injectable()
export class GrammarRulesService {
  constructor(@InjectModel(GrammarRule.name) private model: Model<GrammarRuleDocument>) {}

  async findAll(level?: string) {
    const filter: any = {};
    if (level) filter.level = level;
    return this.model.find(filter).lean();
  }

  async findBySlug(slug: string) {
    const rule = await this.model.findOne({ slug }).lean();
    if (!rule) throw new NotFoundException('Grammar rule not found');
    return rule;
  }

  async bulkCreate(rules: any[]) {
    let inserted = 0, skipped = 0, errors = 0;
    for (const rule of rules) {
      try {
        const exists = await this.model.findOne({ slug: rule.slug });
        if (exists) { skipped++; continue; }
        await this.model.create(rule);
        inserted++;
      } catch { errors++; }
    }
    return { inserted, skipped, errors };
  }
}
