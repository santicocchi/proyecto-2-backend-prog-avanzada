import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedorXProductoService } from './proveedor_x_producto.service';
import { CreateProveedorXProductoDto } from './dto/create-proveedor_x_producto.dto';
import { UpdateProveedorXProductoDto } from './dto/update-proveedor_x_producto.dto';

@Controller('proveedor-x-producto')
export class ProveedorXProductoController {
  constructor(private readonly proveedorXProductoService: ProveedorXProductoService) {}

  @Post()
  create(@Body() createProveedorXProductoDto: CreateProveedorXProductoDto) {
    return this.proveedorXProductoService.create(createProveedorXProductoDto);
  }

  @Get()
  findAll() {
    return this.proveedorXProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorXProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorXProductoDto: UpdateProveedorXProductoDto) {
    return this.proveedorXProductoService.update(+id, updateProveedorXProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorXProductoService.remove(+id);
  }
}
