import { Module } from '@nestjs/common';
import { LineaService } from './linea.service';
import { LineaController } from './linea.controller';

@Module({
  controllers: [LineaController],
  providers: [LineaService],
})
export class LineaModule {}
