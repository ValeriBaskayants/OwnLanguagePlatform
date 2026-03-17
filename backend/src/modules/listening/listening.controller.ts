import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ListeningService } from './listening.service';

@Controller('api/listening')
@UseGuards(JwtAuthGuard)
export class ListeningController {
  constructor(private service: ListeningService) {}

  @Get()
  findAll(@Query() q: any) {
    return this.service.findAll({ level: q.level, type: q.type, limit: +q.limit });
  }
}
