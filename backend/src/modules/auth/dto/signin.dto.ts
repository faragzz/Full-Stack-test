import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  declare email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  declare password: string;
}
