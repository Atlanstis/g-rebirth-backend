import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { BusinessException } from 'src/core';
import { MenuAddDto, MenuDeleteDto, MenuSearchDto, MenuUpdateDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  /** 菜单-新增 */
  async add(dto: MenuAddDto) {
    await this.findOne(
      [{ name: dto.name }, { key: dto.key }],
      (menu) => !!menu,
      '当前菜单名称 / 菜单Key 已存在，请更换后重试',
    );
    const menu = this.menuRepo.create(dto);
    return await this.menuRepo.save(menu);
  }

  /** 菜单-编辑 */
  async update(dto: MenuUpdateDto) {
    const menu = await this.findOne(
      { id: dto.id },
      (menu) => !menu,
      '当前菜单不存在',
    );
    await this.findOne(
      [
        {
          name: dto.name,
          id: Not(dto.id),
        },
        {
          key: dto.key,
          id: Not(dto.id),
        },
      ],
      (menu) => !!menu,
      '当前菜单名称 / 菜单Key 已存在，请更换后重试称',
    );
    const newMenu = this.menuRepo.create({ ...menu, ...dto });
    return await this.menuRepo.save(newMenu);
  }

  /** 菜单-分页查询 */
  async page(dto: MenuSearchDto) {
    const { page, size } = dto;
    const [list, total] = await this.menuRepo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: {
        id: 'ASC',
      },
    });
    return {
      list,
      total,
    };
  }

  /** 菜单-删除 */
  async delete(dto: MenuDeleteDto) {
    const menus = await this.menuRepo.find({
      where: { id: In(dto.ids) },
      relations: {
        roles: true,
      },
    });
    // 存在被角色绑定的菜单，则无法删除
    const existRoleMenus = menus.filter((menu) => menu.roles.length > 0);
    if (existRoleMenus.length) {
      const roleNames = existRoleMenus.map((role) => role.name).join('、');
      throw new BusinessException(`菜单（${roleNames}）被绑定，无法删除`);
    }
    await this.menuRepo.remove(menus);
  }

  /**
   * 查找单条菜单数据
   * @param where 查询条件
   * @param judgeFn 异常抛出判断函数，执行为 true 时，抛出异常
   * @param errorMsg 异常信息
   * @returns 菜单数据
   */
  async findOne(
    where: FindOptionsWhere<Menu> | FindOptionsWhere<Menu>[],
    judgeFn: (menu: Menu) => boolean,
    errorMsg = '',
  ) {
    const menu = await this.menuRepo.findOneBy(where);
    if (judgeFn(menu)) {
      throw new BusinessException(errorMsg);
    }
    return menu;
  }
}
