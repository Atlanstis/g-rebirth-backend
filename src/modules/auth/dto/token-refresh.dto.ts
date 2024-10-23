import { Allow } from 'class-validator';

export class TokenRefreshDto {
  @Allow()
  refreshToken: string;
}
