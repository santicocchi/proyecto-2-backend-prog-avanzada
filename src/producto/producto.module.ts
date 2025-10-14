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
import { MarcaRepository } from 'src/marca/marca.repository';
import { LineaRepository } from 'src/linea/linea.repository';
import { LineaModule } from 'src/linea/linea.module';
import { MarcaModule } from 'src/marca/marca.module';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Producto, Marca, ProveedorXProducto]), LineaModule, MarcaModule],
  controllers: [ProductoController],
  providers: [
    ProductoService,
    {
      provide: 'IProductoRepository',
      useClass: ProductoRepository
    },
    {
      provide: 'IMarcaRepository',
      useClass: MarcaRepository
    },
    {
      provide: 'ILineaRepository',
      useClass: LineaRepository
    }

  ],
  exports: [ProductoService, TypeOrmModule],
})
export class ProductoModule {}
