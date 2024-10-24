import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Length,
} from 'class-validator';
import { MenuKeyLength } from '../entities';
import { OmitType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/dto';

export class MenuDto {
  @IsNotEmpty({ message: '菜单 id 不能为空' })
  id: number;

  @IsNotEmpty({ message: '菜单名称不能为空' })
  @Length(MenuKeyLength.nameMin, MenuKeyLength.nameMax, {
    message: `菜单名称长度应在 ${MenuKeyLength.nameMin} - ${MenuKeyLength.nameMax} 个字符之间`,
  })
  name: string;

  @IsNotEmpty({ message: '菜单 Key 不能为空' })
  @Length(MenuKeyLength.keyMin, MenuKeyLength.keyMax, {
    message: `菜单 Key 长度应在 ${MenuKeyLength.keyMin} - ${MenuKeyLength.keyMax} 个字符之间`,
  })
  key: string;
}

export class MenuAddDto extends OmitType(MenuDto, ['id']) {}

export class MenuUpdateDto extends MenuDto {}

export class MenuSearchDto extends PaginationDto {}

export class MenuDeleteDto {
  @IsNotEmpty({ message: '请选择需删除的菜单 id' })
  @IsArray({ message: '菜单 id 格式错误' })
  @ArrayNotEmpty({ message: '请选择需删除的菜单 id' })
  @IsNumber({}, { each: true, message: '菜单 id 格式错误' })
  ids: number[];
}
