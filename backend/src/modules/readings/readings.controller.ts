import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ReadingsService } from './readings.service';

@Controller('api/readings')
@UseGuards(JwtAuthGuard)
export class ReadingsController {
  constructor(private service: ReadingsService) {}

  @Get()
  findAll(@Query('level') level: string, @Query('topic') topic: string) {
    return this.service.findAll(level, topic);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
