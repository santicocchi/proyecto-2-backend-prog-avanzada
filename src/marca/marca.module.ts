import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { Marca } from './entities/marca.entity';
import { MarcaRepository } from './marca.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Linea } from '../linea/entities/linea.entity';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([Marca, Linea])],
  controllers: [MarcaController],
  providers: [
    MarcaService,
    {
      provide: 'IMarcaRepository',
      useClass: MarcaRepository
    }
  ],
  exports: [MarcaService, TypeOrmModule],
})
export class MarcaModule {}
