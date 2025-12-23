import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Ambil daftar role yang dibutuhkan dari handler / controller
    const required = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true; // kalau handler tidak set @Roles, lolos

    const req = context.switchToHttp().getRequest();
    const roleName: string | undefined = req.user?.roleName; // diisi JwtStrategy.validate()

    return !!roleName && required.includes(roleName);
  }
}
