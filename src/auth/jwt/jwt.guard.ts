import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// AuthGuard 는 jwt strategy 를 자동으로 실행시켜준다.
export class JwtAuthGuard extends AuthGuard('jwt') {}
