import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAdvancedDto {
  @ApiPropertyOptional({ type: Number, description: 'ID del cliente' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  clienteId?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID de la forma de pago' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  formaPagoId?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID del usuario responsable' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  userId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Total exacto de la venta' })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  total?: number;
}
