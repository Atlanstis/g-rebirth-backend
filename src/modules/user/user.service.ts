import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { BusinessException } from 'src/core';
import { RegisterDto } from './dto';
import { MethodTypeEnum, User, UserAuthMethod } from './entities';
import { hybridDecrypt, useTransaction } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (user) {
      throw new BusinessException('当前用户已存在');
    }

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
}
