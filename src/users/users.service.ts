import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from '../database/entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getAllUser() {
    return await this.userRepository.find();
  }

  async getUser(userId: string) {
    const post = await this.userRepository.findOne(userId);
    if (post) {
      return post;
    }
    throw new NotFoundException('User not found');
  }

  async updateUser(userId: string, user: UpdateUserDto) {
    await this.userRepository.update(userId, user);
    const updatedUser = await this.userRepository.findOne(userId);
    if (updatedUser) {
      return updatedUser;
    }
    throw new NotFoundException('User not found');
  }

  async deleteUser(userId: string) {
    const deleteResponse = await this.userRepository.softDelete({ id: userId });
    if (!deleteResponse.affected) {
      throw new NotFoundException('User not found');
    }
    return deleteResponse;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password', 'password')
      .where('user.email = :email', { email })
      .getRawOne();

    if (user) {
      return user;
    }
    throw new NotFoundException('User with this email does not exist');
  }
}
