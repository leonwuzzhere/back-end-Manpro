import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // CREATE USER
  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // FIND ALL USERS
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // FIND ONE USER BY ID
  async findOne(iduser: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { iduser } });
    if (!user) {
      throw new NotFoundException(`User with id ${iduser} not found`);
    }
    return user;
  } 

  // -----------------------------
  // Tambahkan ini: cari user by email
  // -----------------------------
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
    // UPDATE USER
  async update(iduser: number, updateData: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { iduser } });
    if (!user) {
      throw new NotFoundException(`User with id ${iduser} not found`);
    }

    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async replace(iduser: number, newData: Partial<User>): Promise<User> {
  const user = await this.usersRepository.findOne({ where: { iduser } });
  if (!user) {
    throw new NotFoundException(`User with id ${iduser} not found`);
  }

  // Replace semua field
  const replacedUser = this.usersRepository.merge(user, newData);
  return this.usersRepository.save(replacedUser);
}
  

}
