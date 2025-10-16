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
import { ProductoXProveedorProviders } from './proveedor_x_producto.providers';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([ProveedorXProducto, Proveedor, Producto])],
  controllers: [ProveedorXProductoController],
  providers: [ProveedorXProductoService,...ProductoXProveedorProviders],
  exports: [ProveedorXProductoService, ...ProductoXProveedorProviders],
})
export class ProveedorXProductoModule {}
