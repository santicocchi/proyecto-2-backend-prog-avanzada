import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { UsersModule } from 'src/auth/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],  
  controllers: [ClienteController],
  providers: [ClienteService],
})
export class ClienteModule {}
