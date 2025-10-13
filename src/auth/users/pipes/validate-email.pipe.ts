// src/modules/users/pipes/validate-email.pipe.ts
import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ValidateEmailPipe implements PipeTransform {
  transform(value: any) {
    if (!value.email || !/\S+@\S+\.\S+/.test(value.email)) {
      throw new BadRequestException('Correo electrónico inválido');
    }
    return value;
  }
}
