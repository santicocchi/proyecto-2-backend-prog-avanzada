import { Module } from '@nestjs/common';
import { TipoDocumentoService } from './tipo_documento.service';
import { TipoDocumentoController } from './tipo_documento.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { Type } from 'class-transformer';
import { TipoDocumento } from './entities/tipo_documento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocumentoRepository } from './tipo_documento.repository';

@Module({
imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([TipoDocumento])],  
  controllers: [TipoDocumentoController],
  providers: [TipoDocumentoService,
    {
      provide: 'ITipoDocumentoRepository',
      useClass: TipoDocumentoRepository 
    }
  ],
  exports: [ TipoDocumentoService, TypeOrmModule],
})
export class TipoDocumentoModule {}
