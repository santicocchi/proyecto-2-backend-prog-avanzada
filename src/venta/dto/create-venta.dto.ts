import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsDateString, ValidateNested, ArrayMinSize, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleVentaInput {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  productoId: number;

  @ApiProperty({ type: Number, example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({ description: 'Fecha en que se realiza la venta.', example: '2025-10-13T15:30:00Z' })
  @IsNotEmpty()
  @IsDate()
  fecha_venta: Date;

  @ApiProperty({ description: 'ID del cliente asociado a la venta.', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  clienteId: number;

  @ApiProperty({ description: 'ID de la forma de pago utilizada en la venta.', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  formaPagoId: number;

  @ApiProperty({ description: 'ID del usuario responsable.', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ type: [CreateDetalleVentaInput], description: 'Detalles de la venta' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaInput)
  @ArrayMinSize(1)
  detallesVenta: CreateDetalleVentaInput[];
}
