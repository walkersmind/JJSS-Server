import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { LoginRequestDto } from './../auth/dto/login.request.dto';
import { AuthService } from './../auth/auth.service';
import { ReadOnlyUserDto } from './dto/user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TransformInterceptor } from './../common/interceptors/success.interceptor';
import { UserRequestDto } from './dto/users.request.dto';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from './users.schema';

@UseInterceptors(TransformInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '피드 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getFeed(@CurrentUser() user: User) {
    console.log(user);
    return user.readOnlyData;
  }

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

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  // logout api
  // 프론트에서 저장되어있는 jwt를 없애면 그 자체로 로그아웃이 된 거
}
