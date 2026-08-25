import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({
    example: '6a8def94f38ffe000261d161',
  })
  declare id: string;

  @ApiProperty({
    example: 'Ahmed Khaled',
  })
  declare name: string;

  @ApiProperty({
    example: 'ahmed@example.com',
  })
  declare email: string;
}
