import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey123', // sama dengan yang ada di JwtModule
    });
  }

  async validate(payload: any) {
    // Data ini nanti bisa diakses di req.user
  console.log('JWT payload:', payload);
  return { iduser: payload.sub, email: payload.email, idrole: payload.idrole };
}

  
}
