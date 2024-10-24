import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import {
  RoleAddDto,
  RoleBindMenusDto,
  RoleDeleteDto,
  RoleSearchDto,
  RoleUpdateDto,
} from './dto';
import { Menu, Role } from 'src/entities';
import { BusinessException } from 'src/core';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  /** 角色-新增 */
  async add(dto: RoleAddDto) {
    await this.findOne(
      { name: dto.name },
      (role) => !!role,
      '当前角色名已存在',
    );
    const role = this.roleRepo.create(dto);
    return await this.roleRepo.save(role);
  }

  /** 角色-编辑 */
  async update(dto: RoleUpdateDto) {
    const role = await this.findOne(
      { id: dto.id },
      (role) => !role,
      '当前角色不存在',
    );
    await this.findOne(
      {
        name: dto.name,
        id: Not(dto.id),
      },
      (role) => !!role,
      '当前角色名已存在，请输入新的角色名',
    );
    const newRole = this.roleRepo.create({ ...role, ...dto });
    return await this.roleRepo.save(newRole);
  }

  /** 角色-分页查询 */
  async page(dto: RoleSearchDto) {
    const { page, size } = dto;
    const [list, total] = await this.roleRepo.findAndCount({
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

  /** 角色-删除 */
  async delete(dto: RoleDeleteDto) {
    const roles = await this.roleRepo.find({
      where: { id: In(dto.ids) },
      relations: {
        users: true,
      },
    });
    // 存在被用户绑定的角色， 则无法删除
    const existUserRoles = roles.filter((role) => role.users.length > 0);
    if (existUserRoles.length) {
      const roleNames = existUserRoles.map((role) => role.name).join('、');
      throw new BusinessException(`角色（${roleNames}）被绑定，无法删除`);
    }
    await this.roleRepo.remove(roles);
  }

  /** 角色绑定菜单 */
  async bindRoles(dto: RoleBindMenusDto) {
    const { roleId, menuIds } = dto;
    let role = await this.findOne(
      { id: roleId },
      (user) => !user,
      '当前角色不存在',
    );
    const menus = await this.menuRepo.find({ where: { id: In(menuIds) } });
    role = this.roleRepo.create({ ...role, menus });
    await this.roleRepo.save(role);
  }

  /**
   * 查找单条角色数据
   * @param where 查询条件
   * @param judgeFn 异常抛出判断函数，执行为 true 时，抛出异常
   * @param errorMsg 异常信息
   * @returns 角色数据
   */
  async findOne(
    where: FindOptionsWhere<Role>,
    judgeFn: (role: Role) => boolean,
    errorMsg = '',
  ) {
    const role = await this.roleRepo.findOneBy(where);
    if (judgeFn(role)) {
      throw new BusinessException(errorMsg);
    }
    return role;
  }
}
