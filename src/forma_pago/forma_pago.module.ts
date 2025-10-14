import { Module } from '@nestjs/common';
import { FormaPagoService } from './forma_pago.service';
import { FormaPagoController } from './forma_pago.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormaPago } from './entities/forma_pago.entity';
import { FormaPagoRepository } from './forma_pago.repository';

@Module({
  imports: [JwtModule, UsersModule, TypeOrmModule.forFeature([FormaPago])],
  controllers: [FormaPagoController],
  providers: [FormaPagoService, FormaPagoRepository],
  exports: [FormaPagoRepository],
})
export class FormaPagoModule {}
