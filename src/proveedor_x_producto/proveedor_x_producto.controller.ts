import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProveedorXProductoService } from './proveedor_x_producto.service';
import { CreateProveedorXProductoDto } from './dto/create-proveedor_x_producto.dto';
import { UpdateProveedorXProductoDto } from './dto/update-proveedor_x_producto.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('proveedor-x-producto')
export class ProveedorXProductoController {
  constructor(private readonly proveedorXProductoService: ProveedorXProductoService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_PROVEEDOR))
  @Post()
  create(@Body() createProveedorXProductoDto: CreateProveedorXProductoDto) {
    return this.proveedorXProductoService.create(createProveedorXProductoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_PROVEEDORES))
  @Get()
  findAll() {
    return this.proveedorXProductoService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_PROVEEDOR))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorXProductoService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_PROVEEDOR))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorXProductoDto: UpdateProveedorXProductoDto) {
    return this.proveedorXProductoService.update(+id, updateProveedorXProductoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_PROVEEDOR))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorXProductoService.remove(+id);
  }
}
