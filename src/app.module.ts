import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineaModule } from './linea/linea.module';
import { MarcaModule } from './marca/marca.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ProductoModule } from './producto/producto.module';
import { DetalleVentaModule } from './detalle_venta/detalle_venta.module';
import { VentaModule } from './venta/venta.module';
import { FormaPagoModule } from './forma_pago/forma_pago.module';
import { ClienteModule } from './cliente/cliente.module';
import { TipoDocumentoModule } from './tipo_documento/tipo_documento.module';
import { ProveedorXProductoModule } from './proveedor_x_producto/proveedor_x_producto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from './auth/users/users.module';
import { RoleModule } from './auth/role/role.module';
import { PermissionEntity } from './auth/permission/entities/permission.entity';

@Module({
  imports: [LineaModule, MarcaModule, ProveedorModule, 
    ProductoModule, DetalleVentaModule, VentaModule, 
    FormaPagoModule, ClienteModule, TipoDocumentoModule,
    ProveedorXProductoModule, JwtModule, UsersModule, RoleModule, PermissionEntity,
  TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        schema: configService.get('DB_SCHEMA'),
        entities: entities,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
