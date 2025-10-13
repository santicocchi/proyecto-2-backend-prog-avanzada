import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { JwtModule } from '../jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [
    JwtModule,
    // UsersModule participa del ciclo (Role -> Users -> Owner -> Role)
    forwardRef(() => UsersModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
