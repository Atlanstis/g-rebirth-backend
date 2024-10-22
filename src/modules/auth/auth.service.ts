import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { BusinessException } from 'src/core';
import { hybridDecrypt } from 'src/utils';
import { LoginDto } from './dto';
import { MethodTypeEnum, UserAuthMethod } from '../user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuthMethod)
    private readonly userAuthMethodRepo: Repository<UserAuthMethod>,
  ) {}

  /** 账号密码登录 */
  async login(dto: LoginDto) {
    const userAuthMethod = await this.userAuthMethodRepo.findOne({
      where: {
        methodType: MethodTypeEnum.password,
        user: { username: dto.username },
      },
    });
    const errorMsg = '用户名或密码错误';
    if (!userAuthMethod) throw new BusinessException(errorMsg);

    const passwordDecrypted = hybridDecrypt(
      dto.password.data,
      dto.password.key,
      dto.password.iv,
    );
    const valid = await argon.verify(
      userAuthMethod.password,
      passwordDecrypted,
    );
    if (!valid) throw new BusinessException(errorMsg);
  }
}
