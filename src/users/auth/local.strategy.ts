import { User } from './../schemas/users.schema';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  // constructor(
  //   @InjectRepository(User)
  //   private readonly userRepository: Repository<User>,
  // ) {
  //   super();
  // }

  // // username과 password 확인
  // public async validate(username: string, password: string): Promise<any>;
}
