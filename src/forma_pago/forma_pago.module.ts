import { Module } from '@nestjs/common';
import { FormaPagoService } from './forma_pago.service';
import { FormaPagoController } from './forma_pago.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],  
  controllers: [FormaPagoController],
  providers: [FormaPagoService],
})
export class FormaPagoModule {}
