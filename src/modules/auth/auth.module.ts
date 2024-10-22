import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAuthMethod } from '../user';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuthMethod])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
