// src/venta/pipes/find-advanced.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FindAdvancedDto } from '../dto/find-advanced.dto';

@Injectable()
export class FindAdvancedPipe implements PipeTransform {
  transform(value: any): FindAdvancedDto {
    // value viene de req.query (strings en su mayoría)
    const out: FindAdvancedDto = {};

    // helper interno: parsea int positivo
    const toInt = (v: any): number | undefined => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      if (!Number.isFinite(n)) throw new BadRequestException(`Parámetro inválido: ${v}`);
      return Math.trunc(n);
    };

    const toNumber = (v: any): number | undefined => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      if (!Number.isFinite(n)) throw new BadRequestException(`Parámetro inválido: ${v}`);
      return n;
    };

    // ids (enteros >=1)
    const clienteId = toInt(value.clienteId);
    if (clienteId !== undefined && clienteId < 1) throw new BadRequestException('clienteId debe ser >= 1');
    out.clienteId = clienteId;

    const formaPagoId = toInt(value.formaPagoId);
    if (formaPagoId !== undefined && formaPagoId < 1) throw new BadRequestException('formaPagoId debe ser >= 1');
    out.formaPagoId = formaPagoId;

    const userId = toInt(value.userId);
    if (userId !== undefined && userId < 1) throw new BadRequestException('userId debe ser >= 1');
    out.userId = userId;

    // total (number >= 0)
    const total = toNumber(value.total);
    if (total !== undefined && total < 0) throw new BadRequestException('total debe ser >= 0');
    out.total = total;

    // paginación
    const take = toInt(value.take);
    out.take = take && take > 0 ? take : 10;

    const page = toInt(value.page);
    out.page = page && page > 0 ? page : 1;

    return out;
  }
}
