import { IsNotEmpty } from 'class-validator';

/** 加密数据验证 */
export class EncryptDto {
  @IsNotEmpty({ message: 'data 不存在' })
  data: string;
  @IsNotEmpty({ message: 'iv 不存在' })
  iv: string;
  @IsNotEmpty({ message: 'key 不存在' })
  key: string;
}
