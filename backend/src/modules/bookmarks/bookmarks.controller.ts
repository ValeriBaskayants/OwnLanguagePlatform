import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BookmarksService } from './bookmarks.service';

@Controller('api/bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private service: BookmarksService) {}

  @Get()
  findAll(@Request() req: any) { return this.service.findAll(req.user.sub); }

  @Post()
  toggle(@Request() req: any, @Body() body: { itemId: string; itemType: string }) {
    return this.service.toggle(req.user.sub, body.itemId, body.itemType);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.sub, id);
  }
}
