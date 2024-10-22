import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { getPublicKey } from './helpers';
import { LoginDto } from './dto';

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
}
