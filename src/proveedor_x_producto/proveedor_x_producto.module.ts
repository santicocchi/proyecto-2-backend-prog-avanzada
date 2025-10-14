import { Module } from '@nestjs/common';
import { ProveedorXProductoService } from './proveedor_x_producto.service';
import { ProveedorXProductoController } from './proveedor_x_producto.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { ProveedorXProducto } from './entities/proveedor_x_producto.entity';
import { ProveedorXProductoRepository } from './proveedor_x_producto.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([ProveedorXProducto, Proveedor, Producto])],
  controllers: [ProveedorXProductoController],
  providers: [
    ProveedorXProductoService,
    {
      provide: 'IProveedorXProductoRepository',
      useClass: ProveedorXProductoRepository
    }
  ],
  exports: [ProveedorXProductoService, TypeOrmModule],
})
export class ProveedorXProductoModule {}
