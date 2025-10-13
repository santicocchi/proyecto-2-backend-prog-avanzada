import { Module } from '@nestjs/common';
import { LineaService } from './linea.service';
import { LineaController } from './linea.controller';
import { UsersModule } from 'src/auth/users/users.module';
import { JwtModule } from 'src/auth/jwt/jwt.module';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [LineaController],
  providers: [LineaService],
})
export class LineaModule {}
