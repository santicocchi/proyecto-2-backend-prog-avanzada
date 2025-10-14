import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({description: 'Nombre del proveedor. Debe ser único.',example: 'Proveedores S.A.',maxLength: 100,})
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @ApiProperty({description: 'Dirección del proveedor.',example: 'Av. Colón 1234, Córdoba, Argentina',maxLength: 150,})
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  direccion: string;

  cuit: string;
}
