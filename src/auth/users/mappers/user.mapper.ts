// src/modules/users/mappers/user.mapper.ts
import { UserEntity } from '../entities/user.entity';
import { RegisterDTO } from '../../interfaces/register.dto';

export class UserMapper {
  static toEntity(dto: RegisterDTO): UserEntity {
    const entity = new UserEntity();
    entity.email = dto.email;
    entity.password = dto.password;
    return entity;
  }
}
