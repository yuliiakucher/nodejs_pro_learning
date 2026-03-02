import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Body,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  //   @Query('page') page: string,
  // ) {
  //   return this.usersService.update(id, updateUserDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.delete(id);
  // }
}
