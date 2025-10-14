import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class CreateProveedorXProductoDto {
  @ApiProperty({description: 'ID del proveedor asociado.',example: 1,})
  @IsNotEmpty()
  @IsNumber()
  proveedorId: number;

  @ApiProperty({description: 'ID del producto asociado.',example: 5,})
  @IsNotEmpty()
  @IsNumber()
  productoId: number;

  @ApiProperty({description: 'Precio que el proveedor ofrece para el producto.',example: 1250.50,})
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_proveedor: number;

  @ApiProperty({description: 'Código interno que el proveedor utiliza para identificar el producto.',example: 'PROV-AX12',maxLength: 50,})
  @IsString()
  @IsNotEmpty()
  codigo_proveedor: string;
}