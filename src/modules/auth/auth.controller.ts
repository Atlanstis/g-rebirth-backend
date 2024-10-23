import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getPublicKey } from './helpers';
import { LoginDto, TokenRefreshDto } from './dto';
import { JwtGuard } from 'src/core';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 获取 publicKey */
  @Get('/public-key')
  getPublicKey() {
    return getPublicKey();
  }

  /** 账号密码登录 */
  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  /** 刷新 refreshToken */
  @Post('/token/refresh')
  async tokenRefresh(@Body() dto: TokenRefreshDto) {
    return await this.authService.tokenRefresh(dto);
  }

  /** 登录用户信息 */
  @Get('/info')
  @UseGuards(JwtGuard)
  async info(@Req() req: Request) {
    return await this.authService.info(req.user);
  }
}
