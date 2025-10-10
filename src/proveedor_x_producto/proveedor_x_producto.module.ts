import { Module } from '@nestjs/common';
import { ProveedorXProductoService } from './proveedor_x_producto.service';
import { ProveedorXProductoController } from './proveedor_x_producto.controller';

@Module({
  controllers: [ProveedorXProductoController],
  providers: [ProveedorXProductoService],
})
export class ProveedorXProductoModule {}
