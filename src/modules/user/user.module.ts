import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAuthMethod } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuthMethod])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}