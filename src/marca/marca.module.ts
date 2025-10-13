import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
    imports: [JwtModule, UsersModule],
  controllers: [MarcaController],
  providers: [MarcaService],
})
export class MarcaModule {}
