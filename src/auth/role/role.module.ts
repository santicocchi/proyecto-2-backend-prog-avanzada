import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { JwtModule } from '../jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { RoleRepository } from './role.repository';
import { PermissionRepository } from '../permission/permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '../permission/entities/permission.entity';

@Module({
  imports: [
    JwtModule,
    // UsersModule participa del ciclo (Role -> Users -> Owner -> Role)
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity])
  ],
  controllers: [RoleController],
  providers: [RoleService,
    {
          provide: 'IRoleRepository',
          useClass: RoleRepository,
        },
        {
          provide: 'IPermissionRepository',
          useClass: PermissionRepository,
        },
  ],
  exports: [RoleService],
})
export class RoleModule {}
