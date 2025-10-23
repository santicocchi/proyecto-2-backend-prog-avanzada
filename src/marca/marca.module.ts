import { forwardRef, Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { Marca } from './entities/marca.entity';
import { MarcaRepository } from './marca.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linea } from '../linea/entities/linea.entity';
import { MarcaProviders } from './marca.providers';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
  imports: [JwtModule, UsersModule, forwardRef(() => ProductoModule),TypeOrmModule.forFeature([Marca, Linea]), ],
  controllers: [MarcaController],
  providers: [MarcaService,...MarcaProviders],
  exports: [MarcaService, ...MarcaProviders ],
})
export class MarcaModule {}
