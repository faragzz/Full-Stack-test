import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../validators/match-password.decorator';

export class SignupDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  declare email: string;

  @ApiProperty({ example: 'Jane Doe', minLength: 3 })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  declare name: string;

  @ApiProperty({
    example: 'Str0ng!Pass',
    description:
      'Min 8 chars, at least one letter, one number, one special character',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/(?=.*[A-Za-z])/, {
    message: 'Password must contain at least one letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[^A-Za-z0-9])/, {
    message: 'Password must contain at least one special character',
  })
  declare password: string;

  @ApiProperty({
    example: 'Str0ng!Pass',
    description: 'Must match the password field',
  })
  @IsString()
  @Match('password', {
    message: 'Passwords do not match',
  })
  declare confirmPassword: string;
}
