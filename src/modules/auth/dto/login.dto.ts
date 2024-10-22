import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { EncryptDto } from 'src/core';

export class LoginDto {
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @ValidateNested()
  @IsNotEmpty({ message: '密码不能为空' })
  @Type(() => EncryptDto)
  password: EncryptDto;
}
