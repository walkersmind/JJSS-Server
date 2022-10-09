import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
