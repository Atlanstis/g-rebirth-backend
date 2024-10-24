import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserAuthMethod } from 'src/entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration } from 'src/core';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<Configuration['jwt']>('jwt').secret,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, UserAuthMethod]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
