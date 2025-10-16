import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAdvancedProductoDto {
  @ApiPropertyOptional({ type: Number, description: 'ID de la marca' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  marcaId?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID del proveedor' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  proveedorId?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID de la línea' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  lineaId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Stock mínimo' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  stockDesde?: number;

  @ApiPropertyOptional({ type: Number, description: 'Stock máximo' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  stockHasta?: number;

  @ApiPropertyOptional({ type: Number, description: 'Precio mínimo' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  precioDesde?: number;

  @ApiPropertyOptional({ type: Number, description: 'Precio máximo' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  precioHasta?: number;

  @ApiPropertyOptional({ type: String, description: 'Código de producto del proveedor' })
  @IsOptional()
  @IsString()
  codigoProveedor?: string;

  @ApiPropertyOptional({ type: Number, description: 'Cantidad de resultados por página' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 10))
  take?: number = 10;

  @ApiPropertyOptional({ type: Number, description: 'Número de página' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 1))
  page?: number = 1;
}
