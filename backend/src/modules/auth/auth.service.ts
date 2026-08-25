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

/**
 * Shape returned to the client after any successful auth operation
 * (signup, signin, refresh).
 */
export interface TokenPair {
  /** Short-lived JWT sent as `Authorization: Bearer <accessToken>` on subsequent requests. */
  accessToken: string;
  /** Long-lived opaque secret used only to obtain a new token pair via `/auth/refresh`. */
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Registers a new user and immediately logs them in.
   *
   * @param dto - Validated signup payload containing email, name, and plaintext password.
   * @returns A fresh access/refresh token pair for the newly created user.
   * @throws {ConflictException} If an account with this email already exists.
   */
  async signup(dto: SignupDto): Promise<TokenPair> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.userModel.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    });

    return this.issueTokens(user._id.toString(), user.email);
  }

  /**
   * Verifies a user's credentials and issues a new token pair on success.
   *
   * @param dto - Validated signin payload containing email and plaintext password.
   * @returns A fresh access/refresh token pair for the authenticated user.
   * @throws {UnauthorizedException} If the email doesn't exist or the password doesn't match.
   */
  async signin(dto: SigninDto): Promise<TokenPair> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');

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
   * Exchanges a valid, unrevoked, unexpired refresh token for a brand-new
   * token pair. The presented refresh token is revoked as part of this call
   * (rotation), so it cannot be reused afterward.
   *
   * @param refreshToken - The raw (unhashed) refresh token presented by the client.
   * @returns A new access/refresh token pair.
   * @throws {UnauthorizedException} If the token is invalid, expired, already revoked,
   *   or its owning user no longer exists.
   */
  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenHash = this.hashToken(refreshToken);

    const stored = await this.refreshTokenModel.findOne({
      tokenHash,
      revoked: false,
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userModel.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    stored.revoked = true;
    await stored.save();

    return this.issueTokens(user._id.toString(), user.email);
  }

  /**
   * Revokes a single refresh token, effectively logging the client out of
   * that one session. Other active sessions/devices are unaffected.
   *
   * @param refreshToken - The raw (unhashed) refresh token to revoke.
   * @returns Nothing. Resolves whether or not a matching token was found —
   *   logging out with an already-invalid token is treated as a no-op success.
   */
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.refreshTokenModel.updateOne({ tokenHash }, { revoked: true });
  }

  /**
   * Issues a brand-new access/refresh token pair for a given user and
   * persists a hashed record of the refresh token for later verification,
   * rotation, and revocation.
   *
   * @param userId - MongoDB ObjectId string of the user to issue tokens for.
   * @param email - The user's email, embedded in the JWT payload for convenience.
   * @returns A new access/refresh token pair.
   */
  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: Number(this.config.get<string>('JWT_ACCESS_EXPIRES_IN')),
    });

    const refreshToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(refreshToken);

    const expiresInDays = Number(
      this.config.get<string>('JWT_REFRESH_EXPIRES_DAYS') ?? 30,
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await this.refreshTokenModel.create({
      userId: new Types.ObjectId(userId),
      tokenHash,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Deterministically hashes a refresh token for storage/lookup.
   *
   * SHA-256 (not argon2) is intentional here: the refresh token is already
   * a 512-bit random value, not a low-entropy secret like a password, so it
   * doesn't need a slow, salted KDF — and it *must* be deterministic so we
   * can look it up by exact match (`findOne({ tokenHash })`) instead of
   * scanning and comparing every stored token.
   *
   * @param token - The raw (unhashed) refresh token.
   * @returns The hex-encoded SHA-256 digest of the token.
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
