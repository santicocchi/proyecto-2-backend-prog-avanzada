import { Module } from '@nestjs/common';
import { LineaService } from './linea.service';
import { LineaController } from './linea.controller';
import { UsersModule } from 'src/auth/users/users.module';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { Linea } from './entities/linea.entity';
import { Marca } from '../marca/entities/marca.entity';
import { LineaRepository } from './linea.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineaProviders } from './linea.providers';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Linea, Marca])],
  controllers: [LineaController],
  providers: [LineaService, ...LineaProviders],
  exports: [LineaService, ...LineaProviders],
})
export class LineaModule {}
