import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@Controller('api/sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private service: SessionsService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.service.createSession(req.user.sub, body);
  }

  @Get('history')
  getHistory(@Request() req: any) {
    return this.service.getHistory(req.user.sub);
  }
}
