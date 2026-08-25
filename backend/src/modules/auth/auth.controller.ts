import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import type { CookieOptions, Request, Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';

import { AuthService, TokenPair } from './auth.service';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly accessTokenCookieName: string;
  private readonly refreshTokenCookieName: string;

  private readonly accessTokenMaxAge: number;
  private readonly refreshTokenMaxAge: number;

  private readonly cookieDomain?: string;
  private readonly sameSite: CookieOptions['sameSite'];
  private readonly isProd: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenCookieName = this.configService.get<string>(
      'COOKIE_ACCESS_TOKEN_NAME',
      'access_token',
    );

    this.refreshTokenCookieName = this.configService.get<string>(
      'COOKIE_REFRESH_TOKEN_NAME',
      'refresh_token',
    );

    this.accessTokenMaxAge = this.configService.get<number>(
      'COOKIE_ACCESS_TOKEN_MAX_AGE_MS',
      15 * 60 * 1000,
    );

    this.refreshTokenMaxAge = this.configService.get<number>(
      'COOKIE_REFRESH_TOKEN_MAX_AGE_MS',
      30 * 24 * 60 * 60 * 1000,
    );

    this.cookieDomain =
      this.configService.get<string>('COOKIE_DOMAIN') || undefined;

    this.sameSite = this.configService.get<CookieOptions['sameSite']>(
      'COOKIE_SAME_SITE',
      'strict',
    );

    this.isProd = this.configService.get<string>('NODE_ENV') === 'production';
  }

  /**
   * Creates a new user account.
   *
   * No authentication tokens are generated during signup.
   * The client must authenticate separately through signin.
   */
  @Post('signup')
  @ApiOperation({
    summary: 'Create a new account',
    description:
      'Creates a user account. No authentication tokens or cookies are issued.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Account created successfully. No authentication cookies are issued.',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on the request body.',
  })
  @ApiConflictResponse({
    description: 'An account with this email already exists.',
  })
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    await this.authService.signup(dto);

    return {
      success: true,
      message: 'Account created successfully',
    };
  }

  /**
   * Authenticates the user and creates the authentication session.
   *
   * The access token and refresh token are returned only through
   * HttpOnly cookies and are never included in the response body.
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in',
    description:
      'Authenticates the user and sets access_token and refresh_token as HttpOnly cookies. Tokens are never returned in the response body.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Authentication successful. Access and refresh tokens are issued as HttpOnly cookies.',
    type: AuthResponseDto,
    headers: {
      'Set-Cookie': {
        description:
          'Sets the access_token and refresh_token HttpOnly cookies.',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed on the request body.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password.',
  })
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const tokens = await this.authService.signin(dto);

    this.setAuthCookies(res, tokens);

    return {
      success: true,
      message: 'Signed in successfully',
    };
  }

  /**
   * Rotates the refresh token and issues a new authentication session.
   *
   * The refresh token is read from the HttpOnly cookie.
   * New access and refresh tokens are returned through cookies only.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Refresh authentication',
    description:
      'Reads the refresh_token HttpOnly cookie, rotates it, and sets new access_token and refresh_token cookies.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication cookies successfully refreshed.',
    type: AuthResponseDto,
    headers: {
      'Set-Cookie': {
        description:
          'Replaces the access_token and refresh_token cookies with newly issued tokens.',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is missing, invalid, expired, or revoked.',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const refreshToken = this.getCookie(req, this.refreshTokenCookieName);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refresh(refreshToken);

    this.setAuthCookies(res, tokens);

    return {
      success: true,
      message: 'Tokens refreshed successfully',
    };
  }

  /**
   * Revokes the current refresh token and clears both
   * authentication cookies from the browser.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refresh_token')
  @ApiOperation({
    summary: 'Log out',
    description:
      'Revokes the current refresh token and clears the access_token and refresh_token HttpOnly cookies.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session revoked and authentication cookies cleared.',
    type: LogoutResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'Expires the access_token and refresh_token cookies.',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const refreshToken = this.getCookie(req, this.refreshTokenCookieName);

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    this.clearAuthCookies(res);

    return {
      success: true,
    };
  }

  /**
   * Safely retrieves a string cookie without using `any`.
   *
   * @param req - Express request containing parsed cookies.
   * @param cookieName - Name of the cookie to retrieve.
   * @returns The cookie value when it is a string; otherwise undefined.
   */
  private getCookie(req: Request, cookieName: string): string | undefined {
    const cookies: unknown = req.cookies;

    if (
      typeof cookies !== 'object' ||
      cookies === null ||
      !Object.prototype.hasOwnProperty.call(cookies, cookieName)
    ) {
      return undefined;
    }

    const value: unknown = Reflect.get(cookies, cookieName);

    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Sets the access and refresh authentication cookies.
   *
   * @param res - Express response used to set cookies.
   * @param tokens - Newly generated authentication tokens.
   */
  private setAuthCookies(res: Response, tokens: TokenPair): void {
    const baseOptions: CookieOptions = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.sameSite,
      ...(this.cookieDomain ? { domain: this.cookieDomain } : {}),
    };

    res.cookie(this.accessTokenCookieName, tokens.accessToken, {
      ...baseOptions,
      path: '/',
      maxAge: this.accessTokenMaxAge,
    });

    res.cookie(this.refreshTokenCookieName, tokens.refreshToken, {
      ...baseOptions,

      // Refresh token is only sent to /auth endpoints.
      path: '/auth',

      maxAge: this.refreshTokenMaxAge,
    });
  }

  /**
   * Clears both authentication cookies.
   *
   * @param res - Express response used to expire cookies.
   */
  private clearAuthCookies(res: Response): void {
    const baseOptions: CookieOptions = {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.sameSite,
      ...(this.cookieDomain ? { domain: this.cookieDomain } : {}),
    };

    res.clearCookie(this.accessTokenCookieName, {
      ...baseOptions,
      path: '/',
    });

    res.clearCookie(this.refreshTokenCookieName, {
      ...baseOptions,
      path: '/auth',
    });
  }
}
