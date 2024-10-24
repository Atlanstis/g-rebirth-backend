import { Role } from 'src/entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const MenuKeyLength = {
  nameMin: 2,
  nameMax: 16,
  keyMin: 2,
  keyMax: 32,
};

@Entity({ name: 'menu', comment: '菜单' })
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    comment: '菜单名称',
    length: MenuKeyLength.nameMax,
    unique: true,
  })
  name: string;

  @Column({
    name: 'key',
    comment: 'Key',
    length: MenuKeyLength.keyMax,
    unique: true,
  })
  key: string;

  @ManyToMany(() => Role, (role) => role.menus)
  @JoinTable({
    name: 'role_menu',
    joinColumn: {
      name: 'menu_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
