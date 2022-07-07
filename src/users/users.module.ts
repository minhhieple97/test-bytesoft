import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { GetUserInterceptor } from './interceptors/get-user.interceptor';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide:APP_INTERCEPTOR, useClass:GetUserInterceptor //set up global interceptor
    }
  ]
})
export class UsersModule {}
