import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedorXProductoDto } from './create-proveedor_x_producto.dto';

export class UpdateProveedorXProductoDto extends PartialType(CreateProveedorXProductoDto) {
    updatedAt?: Date;
}
