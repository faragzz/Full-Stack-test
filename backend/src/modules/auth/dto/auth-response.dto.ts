import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: true,
  })
  declare success: boolean;

  @ApiProperty({
    example: 'Signed in successfully',
  })
  declare message: string;
}
