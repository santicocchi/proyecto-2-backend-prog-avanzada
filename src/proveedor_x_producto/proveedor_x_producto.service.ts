import { Injectable } from '@nestjs/common';
import { CreateProveedorXProductoDto } from './dto/create-proveedor_x_producto.dto';
import { UpdateProveedorXProductoDto } from './dto/update-proveedor_x_producto.dto';

@Injectable()
export class ProveedorXProductoService {
  create(createProveedorXProductoDto: CreateProveedorXProductoDto) {
    return 'This action adds a new proveedorXProducto';
  }

  findAll() {
    return `This action returns all proveedorXProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedorXProducto`;
  }

  update(id: number, updateProveedorXProductoDto: UpdateProveedorXProductoDto) {
    return `This action updates a #${id} proveedorXProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedorXProducto`;
  }
}
