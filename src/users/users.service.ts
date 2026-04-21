import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from './entities/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
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

  async update(id: string, dto: UpdateUserDto) {
    const { name, email, roleIds } = dto;

    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    if (roleIds && roleIds.length > 0) {
      const roles = await this.rolesRepository.find({
        where: {
          id: In(roleIds),
        },
      });

      return this.userRepository.save({ ...user, roles });
    }

    return this.userRepository.save({ ...user, email, name });
  }
}
