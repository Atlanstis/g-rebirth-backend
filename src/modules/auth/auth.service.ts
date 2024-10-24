import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import {
  BusinessException,
  Configuration,
  ResponseCode,
  UnauthorizedException,
} from 'src/core';
import { hybridDecrypt } from 'src/utils';
import { LoginDto, TokenRefreshDto } from './dto';
import { MethodTypeEnum, User, UserAuthMethod } from 'src/entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createJwt, getJwtRedisKey } from 'src/utils';
import { RedisService } from 'src/util-modules';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAuthMethod)
    private readonly userAuthMethodRepo: Repository<UserAuthMethod>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  /** 账号密码登录 */
  async login(dto: LoginDto) {
    // 查询是否存在密码登录方式
    const userAuthMethod = await this.userAuthMethodRepo.findOne({
      where: {
        methodType: MethodTypeEnum.password,
        user: { username: dto.username },
      },
      relations: { user: true },
    });
    const errorMsg = '用户名或密码错误';
    if (!userAuthMethod) throw new BusinessException(errorMsg);

    // 验证密码是否正确
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

    // 生成 jwt，存入 redis，返回至客户端
    const payload = { id: userAuthMethod.user.id };
    return await this.registerToken(payload);
  }

  async tokenRefresh(dto: TokenRefreshDto) {
    debugger;
    const error = new UnauthorizedException(
      '认证已失效，请重新登录',
      ResponseCode.UNAUTHORIZED,
    );
    if (!dto.refreshToken) {
      throw error;
    }
    let payload: App.JwtPayload;
    try {
      payload = await this.jwtService.verify(dto.refreshToken);
    } catch {
      throw error;
    }
    const refreshToken = await this.redisService.get<string>(
      getJwtRedisKey(payload.id, 'refresh'),
    );
    if (!refreshToken && refreshToken !== dto.refreshToken) {
      throw error;
    }
    payload = { id: payload.id };
    return await this.registerToken(payload);
  }

  /** 登录用户信息 */
  async info(payload: App.JwtPayload) {
    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    if (!user) {
      throw new UnauthorizedException(
        '当前用户不存在，请重新登录',
        ResponseCode.UNAUTHORIZED,
      );
    }
    return user;
  }

  /**
   * 生成 jwt，存入 redis，返回至客户端
   * @param username 用户名
   * @param id 用户id
   * @returns token 对象
   */
  async registerToken(payload: App.JwtPayload) {
    const { accessExpire, refreshExpire } =
      this.configService.get<Configuration['jwt']>('jwt');
    const accessToken = createJwt(this.jwtService, payload, accessExpire);
    const refreshToken = createJwt(this.jwtService, payload, refreshExpire);
    // 存入 redis
    this.redisService.setWithExpire(
      getJwtRedisKey(payload.id, 'access'),
      accessToken,
      accessExpire,
    );
    this.redisService.setWithExpire(
      getJwtRedisKey(payload.id, 'refresh'),
      refreshToken,
      refreshExpire,
    );
    return { accessToken, refreshToken };
  }
}
