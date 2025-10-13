import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_VENTA))
  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_VENTAS))
  @Get()
  findAll() {
    return this.ventaService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_VENTA))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventaService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_VENTA))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(+id, updateVentaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_VENTA))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventaService.remove(+id);
  }
}
