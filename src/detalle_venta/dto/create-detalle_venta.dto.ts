import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleVentaDto {
  @ApiProperty({ type: Number, example: 1,minimum:1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ type: Number, example: 10.50 })
  subtotal: number;

  @ApiProperty({ type: () => Producto, example: 1 })
  productoId: number;

  @ApiProperty({ type: () => Venta, example: 1 })
  ventaId: number;
}