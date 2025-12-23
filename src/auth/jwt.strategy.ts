import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RoleName } from './roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey123', // sama dengan di JwtModule
    });
  }

  async validate(payload: any) {
    // payload yang dikirim saat login: { sub, email, idrole, (opsional) iddivision }

    // Map idrole (angka) ke nama role
    const roleMap: Record<number, RoleName> = {
      1: RoleName.Pimpinan,
      2: RoleName.Manager,
      3: RoleName.KetuaDivisi,
      4: RoleName.Staf,
    };

    const roleName = roleMap[payload.idrole] ?? RoleName.Staf;

    // Object ini akan jadi req.user
    return {
      iduser: payload.sub,
      email: payload.email ?? null,
      idrole: payload.idrole ?? null,
      roleName,                         // 'Pimpinan' | 'Manager' | 'Ketua Divisi' | 'Staf'
      iddivision: payload.iddivision ?? null, // kalau belum ada di payload, akan null
    };
  }
}
