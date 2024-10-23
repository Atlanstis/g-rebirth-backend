import { type JwtService } from '@nestjs/jwt';

export const AccessTokenKey = 'access_key_';
export const RefreshTokenKey = 'refresh_key_';

/**
 * 生成 jwtToken
 * @param payload 载荷数据
 * @param expiresIn 过期时间
 * @returns jwtToken
 */
export function createJwt(
  jwtService: JwtService,
  payload: App.JwtPayload,
  expiresIn: number,
) {
  return jwtService.sign(payload, { expiresIn });
}

/**
 * 获取存入 Redis 的 jwt key
 * @param userId 用户id
 * @param key 类别 access ｜ refresh
 * @returns jwt key
 */
export function getJwtRedisKey(userId: string, key: 'access' | 'refresh') {
  const suffix = key === 'access' ? AccessTokenKey : RefreshTokenKey;
  return `${suffix}${userId}`;
}
