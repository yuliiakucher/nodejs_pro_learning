import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

export enum RoleEnum {
  'admin' = 'admin',
  'manager' = 'manager',
  'user' = 'user',
  'viewer' = 'viewer',
}

@Injectable()
export class UsersService {
  private users = [
    {
      id: 'u_001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: RoleEnum.admin,
    },
    {
      id: 'u_002',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: RoleEnum.manager,
    },
    {
      id: 'u_003',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: RoleEnum.user,
    },
    {
      id: 'u_004',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: RoleEnum.user,
    },
    {
      id: 'u_005',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: RoleEnum.viewer,
    },
  ];

  findAll(RoleEnum: RoleEnum): CreateUserDto[] {
    if (RoleEnum) {
      return this.users.filter((user) => user.role === RoleEnum);
    }
    return this.users;
  }

  findOne(id: string): CreateUserDto | undefined {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  create(user: CreateUserDto) {
    const newId = crypto.randomUUID();
    const newUser = { ...user, id: newId };
    this.users.push(newUser);
  }

  update(id: string, updatedUser: UpdateUserDto) {
    const currentUser = this.users.find((user) => user.id === id);
    if (!currentUser) {
      console.error('User not found');
    }
    this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updatedUser };
      } else return user;
    });
  }

  delete(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
