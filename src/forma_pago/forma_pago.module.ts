import { Module } from '@nestjs/common';
import { FormaPagoService } from './forma_pago.service';
import { FormaPagoController } from './forma_pago.controller';

@Module({
  controllers: [FormaPagoController],
  providers: [FormaPagoService],
})
export class FormaPagoModule {}
