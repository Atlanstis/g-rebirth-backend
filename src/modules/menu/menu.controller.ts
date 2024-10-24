import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuAddDto, MenuDeleteDto, MenuSearchDto, MenuUpdateDto } from './dto';
import { JwtGuard } from 'src/core';

@UseGuards(JwtGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /** 菜单-新增 */
  @Post('add')
  async add(@Body() dto: MenuAddDto) {
    return await this.menuService.add(dto);
  }

  /** 菜单-编辑 */
  @Post('update')
  async update(@Body() dto: MenuUpdateDto) {
    return await this.menuService.update(dto);
  }

  /** 菜单-分页查询 */
  @Post('page')
  async page(@Body() dto: MenuSearchDto) {
    return await this.menuService.page(dto);
  }

  /** 菜单-删除 */
  @Post('delete')
  async delete(@Body() dto: MenuDeleteDto) {
    return await this.menuService.delete(dto);
  }
}
