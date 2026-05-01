import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthPayloadDto, RefreshTokenPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.validateUser(authPayloadDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refreshTokenPayloadDto: RefreshTokenPayloadDto) {
    return this.authService.refreshToken(refreshTokenPayloadDto);
  }
}
