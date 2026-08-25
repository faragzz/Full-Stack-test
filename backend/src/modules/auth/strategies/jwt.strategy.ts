import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../users/schema/user.schema';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import type { Request } from 'express';
import { AuthenticatedUser } from '../../../common/types/express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    const secret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');

    const accessTokenCookieName = configService.get<string>(
      'COOKIE_ACCESS_TOKEN_NAME',
      'access_token',
    );

    super({
      jwtFromRequest: (req: Request): string | null => {
        const cookies: unknown = req.cookies;

        if (
          typeof cookies !== 'object' ||
          cookies === null ||
          !Object.prototype.hasOwnProperty.call(cookies, accessTokenCookieName)
        ) {
          return null;
        }

        const value: unknown = Reflect.get(cookies, accessTokenCookieName);

        return typeof value === 'string' ? value : null;
      },

      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Validates the decoded JWT payload and resolves the authenticated user.
   *
   * @param payload - Decoded JWT payload containing the user's identifier.
   * @returns The authenticated user's public identity.
   * @throws UnauthorizedException When the user no longer exists.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
