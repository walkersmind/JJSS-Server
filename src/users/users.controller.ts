import { TransformInterceptor } from './../common/interceptors/success.interceptor';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './../auth/jwt/jwt.guard';
import { LoginRequestDto } from './../auth/dto/login.request.dto';
import { AuthService } from './../auth/auth.service';
import { ReadOnlyUserDto } from './dto/user.dto';
import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserRequestDto } from './dto/users.request.dto';
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
  @Post('signup')
  async sighup(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  @ApiOperation({ summary: '카카오 로그인 코드 받기' })
  @Get('oauth/callback/kakao')
  KakaoLoginToken(@Query('code') code: string, @Res() res) {
    return res.json({ kakaoCode: code });
  }

  @ApiOperation({ summary: '카카오 로그인 토큰' })
  @Post('oauth/callback/kakao')
  async kakaoLogin(@Body() body: any): Promise<any> {
    try {
      const { code } = body;
      if (!code) {
        throw new BadRequestException('카카오 로그인 정보가 없습니다.');
      }
      const kakaoUserLoginInfo = await this.usersService.kakaoLogin(code);

      console.log(kakaoUserLoginInfo);

      //카카오 로그인 정보로 로그인 또는 회원가입
      return await this.usersService.signUp(kakaoUserLoginInfo);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  // logout api
  // 프론트에서 저장되어있는 jwt를 없애면 그 자체로 로그아웃이 된 거
}
