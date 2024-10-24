import { IsNotEmpty, IsNumber, Min } from 'class-validator';

/** 分页查询 */
export class PaginationDto {
  @IsNotEmpty({ message: 'page 参数不能为空' })
  @IsNumber({}, { message: 'page 参数格式错误' })
  @Min(1, { message: 'page 参数不能小于 1' })
  page: number;
  @IsNotEmpty({ message: 'size 参数不能为空' })
  @IsNumber({}, { message: 'size 参数格式错误' })
  @Min(1, { message: 'size 参数不能小于 1' })
  size: number;
}
