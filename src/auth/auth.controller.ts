import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --------------------
  // REGISTER
  // --------------------
  @Post('register')
  async register(@Body() userData: Partial<User>) {
    return this.authService.register(userData);
  }

  // --------------------
  // LOGIN
  // --------------------
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    return this.authService.login(body.email, body.password);
  }

  // --------------------
  // PROFILE (protected)
  // --------------------
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user; // ini hasil decode dari token JWT
  }
}
