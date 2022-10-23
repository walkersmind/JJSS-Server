import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import * as qs from 'qs';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

// import { HttpService, HttpModule } from '@nestjs/axios';

import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRequestDto } from './dto/users.request.dto';
import { User, UserDocument } from './users.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}
  private saltOrRounds = 10;

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.userRepository.existByEamil(email);

    if (isUserExist) {
      throw new UnauthorizedException(
        '해당 이메일로 가입된 유저가 이미 존재합니다.',
      );
    }

    // 카카오 로그인 시 비밀번호는 처리는 어떻게 할 지? => 다른 테이블로 관리
    // const hashedPassword = await bcrypt.hash(password, 10);

    const hash = await bcrypt.hash(password, this.saltOrRounds);
    const user = await this.userRepository.create({
      email,
      name,
      password: hash,
    });
    return user.readOnlyData;
  }

  //카카오 로그인 서비스 구현
  async kakaoLogin(code: any): Promise<any> {
    const apiKey = '9f7cabe5fceeb31eb40f58fc5d78c7e9';
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const body = {
      grant_type: 'authorization_code',
      client_id: apiKey,
      redirect_uri: 'http://localhost:3000/users/oauth/callback/kakao',
      code,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charshet=utf-8',
    };

    try {
      const response = await axios({
        method: 'POST',
        url: kakaoTokenUrl,
        timeout: 30000,
        headers,
        data: qs.stringify(body),
      });
      if (response.status === 200) {
        // console.log(`2. info: ${JSON.stringify(response.data)}`);
        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };
        //console.log(`3. url : ${kakaoTokenUrl}`);
        //console.log(`4. headers : ${JSON.stringify(headerUserInfo)}`);
        const kakaoTokenData = response.data;

        //console.log(kakaoTokenData);
        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });
        if (responseUserInfo.status === 200) {
          // console.log(`userinfo: ${JSON.stringify(responseUserInfo.data)}`);
          const kakaoUserInfo = responseUserInfo.data;

          // console.log(kakaoUserInfo);

          //회원가입에 필요한 정보 받기
          const registerUserInfo = {
            id: kakaoUserInfo['id'],
            username: kakaoUserInfo['kakao_account']['profile']['nickname'],
            email: kakaoUserInfo['kakao_account']['email'],
          };

          const userTokens = {
            access_token: kakaoTokenData['access_token'],
            refresh_token: kakaoTokenData['refresh_token'],
          };

          return registerUserInfo;
          //이 정보로 가입이 안되어 있으면 데이터베이스에 가입시키고
          //가입되어 있다면 로그인 코드 발급
          //가입되어 있지만 중복 처리를 못하는 오류
        } else {
          throw new UnauthorizedException();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
