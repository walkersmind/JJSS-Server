import { Model } from 'mongoose';
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

    const hash = await bcrypt.hash(password, this.saltOrRounds);
    const user = await this.userRepository.create({
      email,
      name,
      password: hash,
    });

    return user.readOnlyData;
  }
}
