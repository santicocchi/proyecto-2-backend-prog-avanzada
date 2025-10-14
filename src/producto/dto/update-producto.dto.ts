import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
    updatedAt?: Date;
    marcaId?: number;
    lineaId?: number;
}
