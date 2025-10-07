import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

@Controller('auth') // <-- ini bikin prefix /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // <-- ini bikin endpoint POST /auth/register
  async register(@Body() userData: Partial<User>) {
    return this.authService.register(userData);
  }
}
