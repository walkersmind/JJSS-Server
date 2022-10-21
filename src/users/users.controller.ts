import { ReadOnlyUserDto } from './dto/user.dto';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TransformInterceptor } from './../common/interceptors/success.interceptor';
import { UserRequestDto } from './dto/users.request.dto';
import { UsersService } from './users.service';

@UseInterceptors(TransformInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ReadOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async sighup(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }
}
