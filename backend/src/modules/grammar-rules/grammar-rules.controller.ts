import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GrammarRulesService } from './grammar-rules.service';

@Controller('api/grammar-rules')
@UseGuards(JwtAuthGuard)
export class GrammarRulesController {
  constructor(private service: GrammarRulesService) {}

  @Get()
  findAll(@Query('level') level: string) {
    return this.service.findAll(level);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
