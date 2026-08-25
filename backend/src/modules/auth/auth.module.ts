import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule, // gives AuthService access to the User + RefreshToken models
    PassportModule, // enables @UseGuards(JwtAuthGuard) via passport-jwt
    JwtModule.register({}), // empty config: AuthService signs tokens per-call
    // with its own secret/expiry per token type (access vs refresh)
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // registers the 'jwt' passport strategy AuthGuard('jwt') looks up
  ],
})
export class AuthModule {}
