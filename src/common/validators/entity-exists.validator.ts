//src/common/validators/entity-exists.validator.ts
import { NotFoundException } from '@nestjs/common';

/**
 * Helper para validar la existencia de entidades en los repositorios.
 * Evita repetir el mismo código en los servicios.
 */
export class EntityExistsValidator {
  static async validate<T>(
    entityPromise: Promise<T | null>,
    entityName: string,
  ): Promise<T> {
    const entity = await entityPromise;
    if (!entity) throw new NotFoundException(`${entityName} no encontrado`);
    return entity;
  }
}
