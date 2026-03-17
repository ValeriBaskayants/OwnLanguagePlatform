import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExercisesService } from './exercises.service';

@Controller('api/exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private service: ExercisesService) {}

  @Get()
  findAll(@Query() q: any) {
    return this.service.findAll({ level: q.level, difficulty: q.difficulty, topic: q.topic, limit: +q.limit });
  }

  @Get('topics')
  getTopics(@Query('level') level: string) {
    return this.service.getTopics(level);
  }
}
