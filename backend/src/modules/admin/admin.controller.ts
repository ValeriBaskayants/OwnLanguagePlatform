import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private service: AdminService) {}

  private checkAdmin(req: any) {
    if (req.user?.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }
  }

  @Post('import/exercises')
  importExercises(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importExercises(body);
  }

  @Post('import/grammar-rules')
  importGrammarRules(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importGrammarRules(body);
  }

  @Post('import/vocabulary')
  importVocabulary(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importVocabulary(body);
  }

  @Post('import/readings')
  importReadings(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importReadings(body);
  }

  @Post('import/multiple-choice')
  importMC(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importMultipleChoice(body);
  }

  @Post('import/writing-prompts')
  importWriting(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importWritingPrompts(body);
  }

  @Post('import/listening')
  importListening(@Body() body: any, @Request() req: any) {
    this.checkAdmin(req);
    return this.service.importListening(body);
  }

  @Get('stats')
  getStats(@Request() req: any) {
    this.checkAdmin(req);
    return this.service.getStats();
  }
}