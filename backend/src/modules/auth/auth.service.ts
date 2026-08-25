import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';

import { User, UserDocument } from '../users/schema/user.schema';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../users/schema/refresh-token.schema';

import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

type MongoDuplicateKeyError = {
  code: 11000;
};

/**
 * Determines whether an unknown error is a MongoDB duplicate-key error.
 *
 * @param error - The unknown error thrown by MongoDB.
 * @returns True when the error represents a duplicate-key violation.
 */
function isMongoDuplicateKeyError(
  error: unknown,
): error is MongoDuplicateKeyError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  if (!('code' in error)) {
    return false;
  }

  return error.code === 11000;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,

    private readonly jwtService: JwtService,

    private readonly config: ConfigService,
  ) {}

  /**
   * Creates a new user account.
   *
   * Passwords are hashed before being persisted. Authentication tokens
   * are intentionally not generated during signup.
   *
   * @param dto - Validated signup data containing email, name, and password.
   * @returns A promise that resolves when the account has been created.
   * @throws ConflictException When the email is already registered.
   */
  async signup(dto: SignupDto): Promise<void> {
    const email = this.normalizeEmail(dto.email);

    const existing = await this.userModel.findOne({ email });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);

    try {
      await this.userModel.create({
        email,
        name: dto.name.trim(),
        password: hashedPassword,
      });
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }

      throw error;
    }
  }

  /**
   * Authenticates a user using their email and password.
   *
   * @param dto - Validated signin credentials.
   * @returns A newly generated access and refresh token pair.
   * @throws UnauthorizedException When the credentials are invalid.
   */
  async signin(dto: SigninDto): Promise<TokenPair> {
    const email = this.normalizeEmail(dto.email);

    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await argon2.verify(user.password, dto.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueTokens(user._id.toString(), user.email);
  }

  /**
   * Rotates a refresh token and creates a new authentication session.
   *
   * The existing refresh token is atomically revoked before the new
   * token pair is created, preventing refresh-token reuse.
   *
   * @param refreshToken - Raw refresh token read from the HttpOnly cookie.
   * @returns A newly generated access and refresh token pair.
   * @throws UnauthorizedException When the token is invalid, expired,
   * revoked, or the associated user no longer exists.
   */
  async refresh(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokenHash = this.hashToken(refreshToken);

    const stored = await this.refreshTokenModel.findOneAndUpdate(
      {
        tokenHash,
        revoked: false,
        expiresAt: {
          $gt: new Date(),
        },
      },
      {
        $set: {
          revoked: true,
          revokedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    );

    if (!stored) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userModel.findById(stored.userId);

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return this.issueTokens(user._id.toString(), user.email);
  }

  /**
   * Revokes a refresh token and invalidates the current session.
   *
   * @param refreshToken - Raw refresh token read from the HttpOnly cookie.
   * @returns A promise that resolves after the token has been revoked.
   */
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);

    await this.refreshTokenModel.updateOne(
      {
        tokenHash,
        revoked: false,
      },
      {
        $set: {
          revoked: true,
          revokedAt: new Date(),
        },
      },
    );
  }

  /**
   * Generates the authentication token pair for a user.
   *
   * The refresh token is stored only as a SHA-256 hash in MongoDB.
   *
   * @param userId - MongoDB identifier of the user.
   * @param email - User email included in the JWT payload.
   * @returns A newly generated access and refresh token pair.
   */
  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: Number(
        this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'),
      ),
    });

    const refreshToken = randomBytes(64).toString('hex');

    const tokenHash = this.hashToken(refreshToken);

    const expiresInDays = Number(
      this.config.get<string>('JWT_REFRESH_EXPIRES_DAYS', '30'),
    );

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await this.refreshTokenModel.create({
      userId: new Types.ObjectId(userId),
      tokenHash,
      expiresAt,
      revoked: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Normalizes an email address before database operations.
   *
   * @param email - Raw email supplied by the client.
   * @returns A trimmed lowercase email address.
   */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Creates a SHA-256 hash of a refresh token.
   *
   * @param token - Raw refresh token.
   * @returns The hexadecimal SHA-256 token hash.
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
