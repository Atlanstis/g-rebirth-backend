import {
  Allow,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Length,
  MaxLength,
} from 'class-validator';
import { RoleKeyLength } from '../entities';
import { OmitType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/dto';

export class RoleDto {
  @IsNotEmpty({ message: '角色 id 不能为空' })
  id: number;

  @IsNotEmpty({ message: '角色名不能为空' })
  @Length(RoleKeyLength.nameMin, RoleKeyLength.nameMax, {
    message: `角色名长度应在 ${RoleKeyLength.nameMin} - ${RoleKeyLength.nameMax} 个字符之间`,
  })
  name: string;
  @Allow()
  @MaxLength(RoleKeyLength.descMax, {
    message: `角色描述长度不能大于 ${RoleKeyLength.descMax} 个字符`,
  })
  desc: string;
}

export class RoleAddDto extends OmitType(RoleDto, ['id']) {}

export class RoleUpdateDto extends RoleDto {}

export class RoleSearchDto extends PaginationDto {}

export class RoleDeleteDto {
  @IsNotEmpty({ message: '请选择需删除的角色 id' })
  @IsArray({ message: '角色 id 格式错误' })
  @ArrayNotEmpty({ message: '请选择需删除的角色 id' })
  @IsNumber({}, { each: true, message: '角色 id 格式错误' })
  ids: number[];
}
