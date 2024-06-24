import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  readonly username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  readonly confirmPassword: string;
}
