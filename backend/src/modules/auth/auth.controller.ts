import { Controller, Post, Get, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

const ALLOWED_EMAILS = [
  'valerifortnite1902@gmail.com',
  'narek.baskayanc02@gmail.com', // ← замени на реальную почту брата
];

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    if (!ALLOWED_EMAILS.includes(body.email.toLowerCase().trim())) {
      throw new ForbiddenException('Registration is closed');
    }
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    return this.authService.getMe(req.user.sub);
  }
}