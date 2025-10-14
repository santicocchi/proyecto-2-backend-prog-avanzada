import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Producto } from 'src/producto/entities/producto.entity';

export class CreateDetalleVentaDto {
  @ApiProperty({ type: Number, example: 1,minimum:1 })
  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  // @ApiProperty({ type: Number, example: 10.50 })
  @IsNumber()
  subtotal: number;

  // @ApiProperty({ type: () => Producto, example: 1 })
  @IsNumber()
  productoId: number;

  // @ApiProperty({ type: () => Venta, example: 1 })
  @IsNumber()
  ventaId: number;
}