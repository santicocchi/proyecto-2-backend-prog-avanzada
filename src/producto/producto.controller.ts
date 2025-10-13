import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_PRODUCTO))
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_PRODUCTOS))
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_PRODUCTO))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_PRODUCTO))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_PRODUCTO))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
