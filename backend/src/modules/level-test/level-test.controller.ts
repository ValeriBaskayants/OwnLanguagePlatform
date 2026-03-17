import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LevelTestService } from './level-test.service';

@Controller('api/level-test')
@UseGuards(JwtAuthGuard)
export class LevelTestController {
  constructor(private service: LevelTestService) {}

  @Get('questions')
  getQuestions(@Request() req: any) {
    return this.service.getQuestions(req.user.sub);
  }

  @Post('submit')
  submit(@Request() req: any, @Body() body: any) {
    return this.service.submitTest(req.user.sub, body);
  }
}
