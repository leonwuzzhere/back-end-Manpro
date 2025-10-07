import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Register: hash password, cek email duplicate, simpan user
  async register(userData: Partial<User>): Promise<Partial<User>> {
    if (!userData.email || !userData.password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.usersService.findByEmail(userData.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await bcrypt.hash(userData.password, 10);
    const created = await this.usersService.create({
      ...userData,
      password: hashed,
    });

    // Jangan kembalikan password ke client
    // kita mengembalikan objek tanpa password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = created;
    return safe as Omit<User, 'password'>;
  }

  // Validasi user: mengembalikan user jika credentials valid, atau null
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
  }

  // Login: cek credentials -> kembalikan JWT
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.iduser,
      email: user.email,
      idrole: user.idrole,
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
