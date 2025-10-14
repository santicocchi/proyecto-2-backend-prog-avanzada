import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { Producto } from './entities/producto.entity';
import { ProductoRepository } from './producto.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from '../marca/entities/marca.entity';
import { ProveedorXProducto } from '../proveedor_x_producto/entities/proveedor_x_producto.entity';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Producto, Marca, ProveedorXProducto])],
  controllers: [ProductoController],
  providers: [
    ProductoService,
    {
      provide: 'IProductoRepository',
      useClass: ProductoRepository
    }
  ],
  exports: [ProductoService, TypeOrmModule],
})
export class ProductoModule {}
