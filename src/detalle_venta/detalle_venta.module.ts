import { forwardRef, Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle_venta.service';
import { DetalleVentaController } from './detalle_venta.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { Producto } from '../producto/entities/producto.entity';
import { DetalleVentaRepository } from './detalle_venta.repository';
import { ProductoRepository } from 'src/producto/producto.repository';
import { VentaModule } from 'src/venta/venta.module';
import { ProductoModule } from 'src/producto/producto.module';
import { VentaRepository } from 'src/venta/venta.repository';
import { Venta } from 'src/venta/entities/venta.entity';
import { DetalleVentaProviders } from './detalle_venta.providers';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([DetalleVenta, Producto, Venta]), forwardRef(() => VentaModule), ProductoModule],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService,...DetalleVentaProviders,
    // {
    //   provide: 'IProductoRepository',
    //   useClass: ProductoRepository
    // },
    // {
    //   provide: 'IVentaRepository',
    //   useClass: VentaRepository
    // }
  ],
  exports: [DetalleVentaService, ...DetalleVentaProviders],
})
export class DetalleVentaModule {}
