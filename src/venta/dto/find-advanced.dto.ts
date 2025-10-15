// src/venta/dto/find-advanced.dto.ts
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAdvancedDto {
  @ApiPropertyOptional({ description: 'ID del cliente' })
  @IsOptional()
  // @IsInt()
  // @Min(1)
  clienteId?: number;

  @ApiPropertyOptional({ description: 'ID de la forma de pago' })
  @IsOptional()
  // @IsInt()
  // @Min(1)
  formaPagoId?: number;

  @ApiPropertyOptional({ description: 'ID del usuario responsable' })
  @IsOptional()
  // @IsInt()
  // @Min(1)
  userId?: number;

  @ApiPropertyOptional({ description: 'Total exacto de la venta' })
  @IsOptional()
  // @IsNumber()
  // @Min(0)
  total?: number;

  @ApiPropertyOptional({ description: 'Cantidad de registros por página', example: 10 })
  @IsOptional()
  // @IsInt()
  // @Min(1)
  take?: number = 10;

  @ApiPropertyOptional({ description: 'Número de página', example: 1 })
  @IsOptional()
  // @IsInt()
  // @Min(1)
  page?: number = 1;
}
