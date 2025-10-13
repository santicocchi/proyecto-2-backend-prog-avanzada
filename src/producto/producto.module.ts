import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
