import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { TokenPairDto } from './dto/token-pair.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account created, tokens issued',
    type: TokenPairDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on the request body',
  })
  @ApiConflictResponse({
    description: 'An account with this email already exists',
  })
  signup(@Body() dto: SignupDto): Promise<TokenPairDto> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credentials valid, tokens issued',
    type: TokenPairDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on the request body',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  signin(@Body() dto: SigninDto): Promise<TokenPairDto> {
    return this.authService.signin(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Exchange a valid refresh token for a new token pair',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Refresh token valid, new tokens issued (old refresh token is revoked)',
    type: TokenPairDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on the request body',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is invalid, expired, or already revoked',
  })
  refresh(@Body() dto: RefreshTokenDto): Promise<TokenPairDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token revoked',
    type: LogoutResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on the request body',
  })
  async logout(@Body() dto: RefreshTokenDto): Promise<LogoutResponseDto> {
    await this.authService.logout(dto.refreshToken);
    return { success: true };
  }
}
