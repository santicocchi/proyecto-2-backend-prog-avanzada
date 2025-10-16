import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { Proveedor } from './entities/proveedor.entity';
import { ProveedorRepository } from './proveedor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorProviders } from './proveedor.providers';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProveedorController],
  providers: [ProveedorService,...ProveedorProviders],
  exports: [ProveedorService, ...ProveedorProviders],
})
export class ProveedorModule { }
