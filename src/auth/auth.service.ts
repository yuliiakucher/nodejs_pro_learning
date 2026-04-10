import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto, RefreshTokenPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

// interface IJwtPayload {
//   sub: string;
//   email: string;
// }

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(authPayloadDto: AuthPayloadDto) {
    const { email, password } = authPayloadDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const claimRoles = user.roles.map((role) => role.claimName);

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      throw new UnauthorizedException();
    }

    const tokensPair = await this.getTokens(user.id, user.email, claimRoles);

    await this.updateRefreshToken(user, tokensPair.refreshToken);

    return tokensPair;
  }

  async refreshToken(refreshTokenPayloadDto: RefreshTokenPayloadDto) {
    const { id, refreshToken } = refreshTokenPayloadDto;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user || !refreshToken) {
      throw new UnauthorizedException();
    }

    const rtMatches = await argon.verify(user.refreshTokenHash, refreshToken);
    if (!rtMatches) {
      throw new UnauthorizedException();
    }

    const claimRoles = user.roles.map((role) => role.claimName);

    const tokensPair = await this.getTokens(user.id, user.email, claimRoles);

    await this.updateRefreshToken(user, tokensPair.refreshToken);

    return tokensPair;
  }

  async getTokens(userId: string, email: string, roles: string[]) {
    const jwtPayload = { sub: userId, email, roles };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(user: UserEntity, refreshToken: string) {
    const rtHash = await argon.hash(refreshToken);

    await this.userRepository.save({ ...user, refreshTokenHash: rtHash });
  }
}
