import { RegisterUserDto } from '../dto/register-users.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.usersHello();
  }

  @Post()
  async signUp(@Body() data: RegisterUserDto) {
    return this.usersService.register(data);
  }
}
