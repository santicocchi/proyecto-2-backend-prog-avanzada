// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { PermissionEntity } from '../permission/entities/permission.entity';
import { JwtService } from '../jwt/jwt.service';
import { UsersRepository } from './users.repository';
import { RoleRepository } from '../role/role.repository';
import { PermissionRepository } from '../permission/permission.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    {
      provide: 'IUserRepository',
      useClass: UsersRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    },
    {
      provide: 'IPermissionRepository',
      useClass: PermissionRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
