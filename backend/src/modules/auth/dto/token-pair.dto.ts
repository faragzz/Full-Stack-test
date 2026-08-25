import { ApiProperty } from '@nestjs/swagger';

export class TokenPairDto {
  @ApiProperty({ description: 'Short-lived JWT used to authenticate requests' })
  declare accessToken: string;

  @ApiProperty({
    description: 'Long-lived opaque token used to obtain a new token pair',
  })
  declare refreshToken: string;
}
