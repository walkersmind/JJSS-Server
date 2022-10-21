import { RegisterUserDto } from './../dto/register-users.dto';
import { LocalStrategy } from './local.strategy';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Module,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // return validateRequest(request);
    return true;
  }
}

// Udemy Style..
@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  providers: [LocalStrategy, AuthService],
  exports: [AuthModule],
})
export class AuthModule {}
