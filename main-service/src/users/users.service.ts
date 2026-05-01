import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from './entities/roles.entity';
import * as bcrypt from 'bcryptjs';

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

  async create(dto: CreateUserDto) {
    const { password, roleIds, ...rest } = dto;

    const passwordHash = await bcrypt.hash(password, 10);

    const roles = roleIds?.length ? await this.getRolesByIds(roleIds) : [];

    const user = this.userRepository.create({ ...rest, passwordHash, roles });

    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const { roleIds, ...rest } = dto;

    const roles = roleIds?.length
      ? await this.getRolesByIds(roleIds)
      : undefined;

    const user = await this.userRepository.preload({
      id,
      roles,
      ...rest,
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.userRepository.save(user);
  }

  private async getRolesByIds(roleIds: string[]) {
    const roles = await this.rolesRepository.find({
      where: {
        id: In(roleIds),
      },
    });
    if (roles.length !== roleIds.length) {
      throw new BadRequestException('Some roles not found');
    }

    return roles;
  }
}
