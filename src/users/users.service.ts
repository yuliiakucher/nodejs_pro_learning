import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  //
  // update(id: string, updatedUser: UpdateUserDto) {
  //   const currentUser = this.users.find((user) => user.id === id);
  //   if (!currentUser) {
  //     console.error('User not found');
  //   }
  //   this.users.map((user) => {
  //     if (user.id === id) {
  //       return { ...user, ...updatedUser };
  //     } else return user;
  //   });
  // }
  //
  // delete(id: string): void {
  //   this.users = this.users.filter((user) => user.id !== id);
  // }
}
