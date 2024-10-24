import { Menu, User } from 'src/entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const RoleKeyLength = {
  nameMin: 2,
  nameMax: 16,
  descMax: 64,
};

export enum RoleStateEnum {
  /** 生效中 */
  active = 'active',
  /** 已失效 */
  inactive = 'inactive',
}

@Entity({ name: 'role', comment: '角色' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    length: RoleKeyLength.nameMax,
    comment: '名称',
    unique: true,
  })
  name: string;

  @Column({
    name: 'desc',
    length: RoleKeyLength.descMax,
    comment: '描述',
    default: '',
  })
  desc: string;

  @Column({
    name: 'is_builtin',
    type: 'tinyint',
    width: 1,
    comment: '是否为系统内置',
    default: 0,
  })
  isBuiltin: number;

  @Column({
    name: 'state',
    type: 'enum',
    comment: '状态',
    enum: RoleStateEnum,
    default: RoleStateEnum.active,
  })
  state: RoleStateEnum;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: Menu[];
}
