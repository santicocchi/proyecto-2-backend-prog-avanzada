//src/venta/venta.module.ts
import { forwardRef, Module } from '@nestjs/common';
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
import { ProductoRepository } from 'src/producto/producto.repository';
import { DetalleVentaRepository } from 'src/detalle_venta/detalle_venta.repository';
import { ClienteModule } from 'src/cliente/cliente.module';
import { ProductoModule } from 'src/producto/producto.module';
import { DetalleVentaModule } from 'src/detalle_venta/detalle_venta.module';
import { FormaPagoModule } from 'src/forma_pago/forma_pago.module';
import { ClienteRepository } from 'src/cliente/cliente.repository';
import { FormaPagoRepository } from 'src/forma_pago/forma_pago.repository';
import { UsersRepository } from 'src/auth/users/users.repository';
import { TipoDocumentoModule } from 'src/tipo_documento/tipo_documento.module';

@Module({
  imports: [
    JwtModule,
    UsersModule,
    TypeOrmModule.forFeature([Venta, Cliente, FormaPago, DetalleVenta, Producto, UserEntity]
    ),
    ClienteModule,
    FormaPagoModule,
    forwardRef(() => DetalleVentaModule),
    ProductoModule,
    TipoDocumentoModule
  ],
  controllers: [VentaController],
  providers: [VentaService, VentaRepository,
    {
      provide: 'IVentaRepository',
      useClass: VentaRepository
    },
    { provide: 'IProductoRepository'
      , useClass: ProductoRepository
     },
     {
      provide: 'IDetalleVentaRepository',
      useClass: DetalleVentaRepository
     },
     {
      provide: 'IClienteRepository',
      useClass: ClienteRepository
     },
     {
      provide: 'IFormaPagoRepository',
      useClass: FormaPagoRepository
     },
     {
      provide: 'IUserRepository',
      useClass: UsersRepository
     }
  ],
  exports: [VentaRepository],
})
export class VentaModule {}
