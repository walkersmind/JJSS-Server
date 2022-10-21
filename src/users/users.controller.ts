import { TransformInterceptor } from './../common/interceptors/success.interceptor';
import { UserRequestDto } from './dto/users.request.dto';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@UseInterceptors(TransformInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async sighup(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }
}
