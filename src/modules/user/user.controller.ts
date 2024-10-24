import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, UserBindRolesDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.userService.register(dto);
  }

  /** 用户绑定角色 */
  @Post('bind/roles')
  async bindRoles(@Body() dto: UserBindRolesDto) {
    return await this.userService.bindRoles(dto);
  }
}
