import { RegisterUserDto } from './dto/register-users.dto';
import { UsersService } from './users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // 프론트에서 넘겨주는 로직
  @Get()
  kakaoLoginCode(@Res() res): any {
    res.send(`
    <div><a
      href="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=9f7cabe5fceeb31eb40f58fc5d78c7e9&redirect_uri=http://localhost:3000/users/oauth/callback/kakao"
      ><img src="https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_medium_narrow.png"></a
    ></div>
    `);
  }

  @ApiOperation({ summary: '일반 사용자 회원가입' })
  @Post()
  async signUp(@Body() body: RegisterUserDto) {
    return this.usersService.register(body);
  }

  @ApiOperation({ summary: '카카오 로그인 코드 받기' })
  @Get('oauth/callback/kakao')
  KakaoLoginToken(@Query('code') code: string, @Res() res) {
    return res.json({ kakaoCode: code });
  }

  @ApiOperation({ summary: '카카오 로그인 토큰' })
  @Post('oauth/callback/kakao')
  async kakaoLogin(@Body() body: any, @Response() res): Promise<any> {
    try {
      const { code } = body;
      if (!code) {
        throw new BadRequestException('카카오 로그인 정보가 없습니다.');
      }
      const kakao = await this.usersService.kakaoLogin(code);

      const kakaoUserLoginInfo = kakao;
      console.log(typeof kakaoUserLoginInfo);
      res.send({
        username: kakaoUserLoginInfo['username'],
        email: kakaoUserLoginInfo['email'],
      });
      //카카오 로그인 정보로 로그인 또는 회원가입하기(중복 검사 안되는 오류)
      return this.usersService.register(kakaoUserLoginInfo);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
