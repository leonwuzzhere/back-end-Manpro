import { SetMetadata } from '@nestjs/common';

/**
 * Pakai di controller/handler:
 *   @Roles('Pimpinan', 'Manager')
 *   @Get('...') ...
 *
 * Nilai string-nya sebaiknya ambil dari enum RoleName,
 * tapi decorator ini menerima string biasa juga.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
