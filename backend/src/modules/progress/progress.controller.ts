import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('api/progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private service: ProgressService) {}

  @Get()
  getProgress(@Request() req: any) {
    return this.service.getUserProgress(req.user.sub);
  }

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.service.getDashboard(req.user.sub);
  }

  @Get('streak')
  getStreak(@Request() req: any) {
    return this.service.getStreak(req.user.sub);
  }
}
