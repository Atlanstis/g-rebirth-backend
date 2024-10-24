import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
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

export class UserBindRolesDto {
  @IsNotEmpty({ message: '用户 id 不能为空' })
  @IsString({ message: '用户 id 格式错误' })
  userId: string;
  @IsNotEmpty({ message: '角色 id 不能为空' })
  @IsArray({ message: '角色 id 格式错误' })
  @ArrayNotEmpty({ message: '角色 id 不能为空' })
  @IsNumber({}, { each: true, message: '角色 id 格式错误' })
  roleIds: [];
}
