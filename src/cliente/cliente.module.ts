import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClienteRepository } from './cliente.repository';
import { TipoDocumento } from 'src/tipo_documento/entities/tipo_documento.entity';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Cliente, TipoDocumento])],
  controllers: [ClienteController],
  providers: [ClienteService, ClienteRepository],
  exports: [ClienteRepository],
})
export class ClienteModule {}
