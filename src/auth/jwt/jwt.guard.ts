import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// AuthGuard 는 jwt strategy 를 자동으로 실행시켜준다.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
