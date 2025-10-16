import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FindAdvancedProductoFilters } from '../interface/IFindAdvanced';

@Injectable()
export class FindAdvancedProductoPipe implements PipeTransform {
  transform(query: any): FindAdvancedProductoFilters {
    const out: FindAdvancedProductoFilters = {
      take: 10,
      page: 1,
    };
    // Funciones auxiliares para conversión y validación
    const toInt = (v: any, field: string, min?: number) => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      if (!Number.isFinite(n)) throw new BadRequestException(`Parámetro inválido: ${field}`);
      const ni = Math.trunc(n);
      if (min !== undefined && ni < min) throw new BadRequestException(`${field} debe ser >= ${min}`);
      return ni;
    };

    const toNum = (v: any, field: string, min?: number) => {
      if (v === undefined || v === null || v === '') return undefined;
      const n = Number(v);
      if (!Number.isFinite(n)) throw new BadRequestException(`Parámetro inválido: ${field}`);
      if (min !== undefined && n < min) throw new BadRequestException(`${field} debe ser >= ${min}`);
      return n;
    };

    // IDs
    out.marcaId = toInt(query.marcaId, 'marcaId', 1);
    out.proveedorId = toInt(query.proveedorId, 'proveedorId', 1);
    out.lineaId = toInt(query.lineaId, 'lineaId', 1);

    // Rangos de stock
    out.stockDesde = toNum(query.stockDesde, 'stockDesde', 0);
    out.stockHasta = toNum(query.stockHasta, 'stockHasta', 0);

    // Rangos de precio
    out.precioDesde = toNum(query.precioDesde, 'precioDesde', 0);
    out.precioHasta = toNum(query.precioHasta, 'precioHasta', 0);

    // Código de proveedor (LIKE)
    if (typeof query.codigoProveedor === 'string' && query.codigoProveedor.trim() !== '') {
      out.codigoProveedor = query.codigoProveedor.trim();
    }

    // Paginación
    const take = toInt(query.take, 'take', 1);
    const page = toInt(query.page, 'page', 1);
    if (take) out.take = take;
    if (page) out.page = page;

    // Validación cruzada opcional (rango coherente)
    if (
      out.stockDesde !== undefined &&
      out.stockHasta !== undefined &&
      out.stockDesde > out.stockHasta
    ) {
      throw new BadRequestException('stockDesde no puede ser mayor que stockHasta');
    }

    if (
      out.precioDesde !== undefined &&
      out.precioHasta !== undefined &&
      out.precioDesde > out.precioHasta
    ) {
      throw new BadRequestException('precioDesde no puede ser mayor que precioHasta');
    }

    return out;
  }
}
