import { Module } from '@nestjs/common';
import { ProveedorXProductoService } from './proveedor_x_producto.service';
import { ProveedorXProductoController } from './proveedor_x_producto.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [ProveedorXProductoController],
  providers: [ProveedorXProductoService],
})
export class ProveedorXProductoModule {}
