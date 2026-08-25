import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description:
      'Short-lived JWT sent as `Authorization: Bearer <accessToken>` on subsequent requests.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  declare accessToken: string;
}
