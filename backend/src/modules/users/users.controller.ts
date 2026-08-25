import { Controller, Get, UseGuards } from '@nestjs/common';

import { MeResponseDto } from './dto/me-response.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

import type { AuthenticatedUser } from '../../common/types/express';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: AuthenticatedUser): MeResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
