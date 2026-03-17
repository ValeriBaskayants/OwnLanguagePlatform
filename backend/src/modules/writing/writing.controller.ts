import { Controller, Get, Post, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WritingService } from './writing.service';

@Controller('api/writing')
@UseGuards(JwtAuthGuard)
export class WritingController {
  constructor(private service: WritingService) {}

  @Get('prompts')
  getPrompts(@Query('level') level: string) {
    return this.service.getPrompts(level);
  }

  @Get('prompts/:id')
  getPrompt(@Param('id') id: string) {
    return this.service.getPromptById(id);
  }

  @Post('submit')
  submit(@Request() req: any, @Body() body: { promptId: string; text: string }) {
    return this.service.submit(req.user.sub, body.promptId, body.text);
  }

  @Get('submissions')
  getSubmissions(@Request() req: any, @Query('promptId') promptId: string) {
    return this.service.getSubmissions(req.user.sub, promptId);
  }

  @Get('submissions/:id')
  getSubmission(@Request() req: any, @Param('id') id: string) {
    return this.service.getSubmission(id, req.user.sub);
  }
}
