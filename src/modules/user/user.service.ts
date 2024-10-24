import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { BusinessException } from 'src/core';
import { RegisterDto, UserBindRolesDto } from './dto';
import { hybridDecrypt, useTransaction } from 'src/utils';
import { Role, MethodTypeEnum, User, UserAuthMethod } from 'src/entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    await this.findOne(
      { username: dto.username },
      (user) => !!user,
      '当前用户名已存在',
    );

    const inTransaction = async (manager: EntityManager) => {
      const newUser = manager.create(User, {
        username: dto.username,
        nickname: dto.nickname,
      });

      await manager.save(newUser);

      const password = hybridDecrypt(
        dto.password.data,
        dto.password.key,
        dto.password.iv,
      );

      const encryptedPassword = await argon.hash(password);

      const authMethod = manager.create(UserAuthMethod, {
        methodType: MethodTypeEnum.password,
        password: encryptedPassword,
        user: newUser,
      });

      await manager.save(authMethod);
    };
    await useTransaction(this.dataSource, inTransaction);
  }

  /** 用户绑定角色 */
  async bindRoles(dto: UserBindRolesDto) {
    const { userId, roleIds } = dto;
    let user = await this.findOne(
      { id: userId },
      (user) => !user,
      '当前用户不存在',
    );
    const roles = await this.roleRepo.find({ where: { id: In(roleIds) } });
    user = this.userRepo.create({ ...user, roles });
    await this.userRepo.save(user);
  }

  /**
   * 查找单条用户数据
   * @param where 查询条件
   * @param judgeFn 异常抛出判断函数，执行为 true 时，抛出异常
   * @param errorMsg 异常信息
   * @returns 角色数据
   */
  async findOne(
    where: FindOptionsWhere<User>,
    judgeFn: (entity: User) => boolean,
    errorMsg = '',
  ) {
    const entity = await this.userRepo.findOneBy(where);
    if (judgeFn(entity)) {
      throw new BusinessException(errorMsg);
    }
    return entity;
  }
}
