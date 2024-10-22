import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { EncryptDto } from 'src/core';

export class RegisterDto {
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @IsNotEmpty({ message: '请输入昵称' })
  nickname: string;

  @ValidateNested()
  @Type(() => EncryptDto)
  @IsNotEmpty({ message: '密码不能为空' })
  password: EncryptDto;
}
