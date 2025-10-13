import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [ProveedorController],
  providers: [ProveedorService],
})
export class ProveedorModule { }
