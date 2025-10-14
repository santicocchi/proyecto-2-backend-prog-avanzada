import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { FormaPago } from '../forma_pago/entities/forma_pago.entity';
import { DetalleVenta } from '../detalle_venta/entities/detalle_venta.entity';
import { Producto } from '../producto/entities/producto.entity';
import { UserEntity } from '../auth/users/entities/user.entity';
import { VentaRepository } from './venta.repository';

@Module({
  imports: [
    JwtModule,
    UsersModule,
    TypeOrmModule.forFeature([Venta, Cliente, FormaPago, DetalleVenta, Producto, UserEntity]),
  ],
  controllers: [VentaController],
  providers: [VentaService, VentaRepository],
  exports: [VentaRepository],
})
export class VentaModule {}
