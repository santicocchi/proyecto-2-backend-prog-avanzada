import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetalleVentaService } from './detalle_venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_DETALLE_VENTA))
  @Post()
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    return this.detalleVentaService.create(createDetalleVentaDto);
  }

  // @UseGuards(AuthGuardFactory(Permissions.LISTAR_DETALLE_VENTAS))
  // @Get()
  // findAll() {
  //   return this.detalleVentaService.findAll();
  // }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_DETALLE_VENTA))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleVentaService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_DETALLE_VENTA))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleVentaDto: UpdateDetalleVentaDto) {
    return this.detalleVentaService.update(+id, updateDetalleVentaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_DETALLE_VENTA))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleVentaService.remove(+id);
  }
}
