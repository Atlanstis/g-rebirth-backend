import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtGuard } from 'src/core';
import { RoleAddDto, RoleDeleteDto, RoleSearchDto, RoleUpdateDto } from './dto';

@Controller('role')
@UseGuards(JwtGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /** 角色-新增 */
  @Post('add')
  async add(@Body() dto: RoleAddDto) {
    return await this.roleService.add(dto);
  }

  /** 角色-编辑 */
  @Post('update')
  async update(@Body() dto: RoleUpdateDto) {
    return await this.roleService.update(dto);
  }

  /** 角色-分页查询 */
  @Post('page')
  async page(@Body() dto: RoleSearchDto) {
    return await this.roleService.page(dto);
  }

  /** 角色-删除 */
  @Post('delete')
  async delete(@Body() dto: RoleDeleteDto) {
    return await this.roleService.delete(dto);
  }
}
