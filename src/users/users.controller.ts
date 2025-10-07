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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto'; // <-- Tambahkan ini

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CREATE USER
  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  // GET ALL USERS
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // GET USER BY ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  // GET PROFILE DARI DB
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req): Promise<Partial<User>> {
    console.log('REQ.USER =>', req.user);
    const user = await this.usersService.findOne(req.user.iduser);

    // jangan balikin password
    const { password, ...safe } = user;
    return safe;
  }

  // UPDATE PROFILE
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const userId = req.user.iduser;
    const updatedUser = await this.usersService.update(userId, updateUserDto);

    // jangan balikin password
    const { password, ...safe } = updatedUser;
    return safe;
  }
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async replaceProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const userId = req.user.iduser;
    const updatedUser = await this.usersService.replace(userId, updateUserDto);

    const { password, ...safe } = updatedUser;
    return safe;
  }
}
