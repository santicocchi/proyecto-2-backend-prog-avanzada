import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle_venta.service';
import { DetalleVentaController } from './detalle_venta.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { Producto } from '../producto/entities/producto.entity';
import { DetalleVentaRepository } from './detalle_venta.repository';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([DetalleVenta, Producto])],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService, DetalleVentaRepository],
  exports: [DetalleVentaRepository],
})
export class DetalleVentaModule {}
