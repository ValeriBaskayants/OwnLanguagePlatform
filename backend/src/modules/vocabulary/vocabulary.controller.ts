import { Controller, Get, Post, Query, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VocabularyService } from './vocabulary.service';

@Controller('api/vocabulary')
@UseGuards(JwtAuthGuard)
export class VocabularyController {
  constructor(private service: VocabularyService) {}

  @Get()
  findAll(@Query() q: any) {
    return this.service.findAll({ level: q.level, type: q.type, search: q.search, limit: +q.limit });
  }

  @Get('flashcards')
  getFlashcards(@Request() req: any, @Query() q: any) {
    return this.service.getFlashcards(req.user.sub, q.level, q.type, +q.limit || 20);
  }

  @Get('user-progress')
  getUserProgress(@Request() req: any) {
    return this.service.getUserProgress(req.user.sub);
  }

  @Post('review')
  review(@Request() req: any, @Body() body: { wordId: string; quality: 0 | 1 | 2 | 3 }) {
    return this.service.reviewWord(req.user.sub, body.wordId, body.quality);
  }
}