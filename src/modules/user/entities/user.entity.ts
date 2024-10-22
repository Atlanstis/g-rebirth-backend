import {
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAuthMethod } from './user-auth-method.entity';

export const UserLength = {
  /** 用户名最大长度 */
  usernameMax: 20,
  /** 昵称最大长度 */
  nickNameMax: 12,
};

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: UserLength.usernameMax,
    name: 'username',
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({ length: UserLength.nickNameMax, name: 'nickname', comment: '昵称' })
  nickname: string;

  @OneToMany(() => UserAuthMethod, (authMethod) => authMethod.user)
  authMethods: UserAuthMethod[];

  @Column({
    name: 'create_time',
    type: 'timestamp',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @BeforeUpdate()
  updateDates() {
    this.updateTime = new Date();
  }
}