// src/producto/producto.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
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
  findAll(@Query() query: any) {
    // query puede tener filtros de ordenamiento: sort, order, etc.
    return this.productoService.findAll(query);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_PRODUCTOS))
  @Get('advanced')
  advancedList(@Query() query: any) {
    return this.productoService.advancedList(query);
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

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_PRODUCTO))
  @Patch(':id/decrease-stock')
  decreaseStock(@Param('id') id: string, @Body('cantidad') cantidad: number) {
    return this.productoService.decreaseStock(+id, cantidad);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_PRODUCTO))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
