import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrammarRule, GrammarRuleSchema } from './schemas/grammar-rule.schema';
import { GrammarRulesService } from './grammar-rules.service';
import { GrammarRulesController } from './grammar-rules.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: GrammarRule.name, schema: GrammarRuleSchema }])],
  controllers: [GrammarRulesController],
  providers: [GrammarRulesService],
  exports: [GrammarRulesService],
})
export class GrammarRulesModule {}
