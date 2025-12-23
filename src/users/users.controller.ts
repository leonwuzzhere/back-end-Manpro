import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
  Put,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

//  import untuk role-based access
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleName } from '../auth/roles.enum';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================
  // 1) ADMIN (Pimpinan & Manager)
  // ============================

  // CREATE USER - hanya boleh dilakukan oleh Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Post()
  async create(@Body() userData: Partial<User>): Promise<Partial<User>> {
    const created = await this.usersService.create(userData);
    // jangan balikin password
    const { password, ...safe } = created;
    return safe;
  }

  // GET ALL USERS - hanya Pimpinan & Manager
  @Roles(RoleName.Pimpinan, RoleName.Manager)
  @Get()
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersService.findAll();
    return users.map((u) => {
      const { password, ...safe } = u;
      return safe;
    });
  }

  // GET USER BY ID
  // - Pimpinan & Manager boleh lihat siapa saja
  // - User biasa hanya boleh lihat dirinya sendiri
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Partial<User>> {
    const requester = req.user;

    const isAdmin =
      requester.roleName === RoleName.Pimpinan ||
      requester.roleName === RoleName.Manager;

    if (!isAdmin && requester.iduser !== id) {
      throw new ForbiddenException('Tidak boleh melihat data user lain');
    }

    const user = await this.usersService.findOne(id);
    const { password, ...safe } = user;
    return safe;
  }

  // ============================
  // 2) PROFIL DIRI SENDIRI
  // ============================

  // GET PROFILE DARI DB (diri sendiri)
  @Get('me/profile')
  async getProfile(@Req() req): Promise<Partial<User>> {
    const user = await this.usersService.findOne(req.user.iduser);

    const { password, ...safe } = user;
    return safe;
  }

  // UPDATE PROFILE (diri sendiri)
  @Patch('me/profile')
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const userId = req.user.iduser;

    // cegah user mengubah role & divisi sendiri
    if ('idrole' in updateUserDto || 'iddivision' in updateUserDto) {
      throw new ForbiddenException(
        'Tidak boleh mengubah role atau divisi sendiri',
      );
    }

    const updatedUser = await this.usersService.update(userId, updateUserDto);

    const { password, ...safe } = updatedUser;
    return safe;
  }

  // REPLACE PROFILE (diri sendiri, full replace – kalau kamu pakai)
  @Put('me/profile')
  async replaceProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const userId = req.user.iduser;

    if ('idrole' in updateUserDto || 'iddivision' in updateUserDto) {
      throw new ForbiddenException(
        'Tidak boleh mengubah role atau divisi sendiri',
      );
    }

    const updatedUser = await this.usersService.replace(userId, updateUserDto);

    const { password, ...safe } = updatedUser;
    return safe;
  }

    // GANTI PASSWORD (diri sendiri)
  @Patch('me/password')
  async changePassword(
    @Req() req,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const userId = req.user.iduser;
    const user = await this.usersService.findOne(userId);

    // 1) cek oldPassword
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Password lama tidak sesuai');
    }

    // 2) cek konfirmasi password baru
    if (dto.newPassword !== dto.confirmPassword) {
      throw new ForbiddenException('Konfirmasi password baru tidak cocok');
    }

    // 3) opsional: cegah password lama sama dengan baru
    if (dto.newPassword === dto.oldPassword) {
      throw new ForbiddenException(
        'Password baru tidak boleh sama dengan password lama',
      );
    }

    // 4) hash password baru
    const hashed = await bcrypt.hash(dto.newPassword, 10);

    // 5) update di DB
    await this.usersService.update(userId, { password: hashed });

    return { message: 'Password berhasil diubah' };
  }

}
