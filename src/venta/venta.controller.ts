//src/venta/venta.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';
import { FindAdvancedDto } from './dto/find-advanced.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { query } from 'express';
import { FindAdvancedPipe } from './pipes/find-advanced.pipe';

@ApiTags('venta')
@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_VENTA))
  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  // @UseGuards(AuthGuardFactory(Permissions.LISTAR_VENTAS))
  // @Get()
  // findAll() {
  //   return this.ventaService.findAll();
  // }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_VENTAS))
  @Get('advanced')
  @ApiOperation({ summary: 'Búsqueda avanzada de ventas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas que cumplen los filtros' })
  @ApiQuery({ name: 'clienteId', required: false, type: Number })
  @ApiQuery({ name: 'formaPagoId', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'total', required: false, type: Number })
  findAdvanced(@Query(FindAdvancedPipe) query: FindAdvancedDto) {
    return this.ventaService.findAdvanced(query);
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_VENTA))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventaService.findOne(+id);
  }

  // @UseGuards(AuthGuardFactory(Permissions.EDITAR_VENTA))
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
  //   return this.ventaService.update(+id, updateVentaDto);
  // }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_VENTA))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventaService.remove(+id);
  }
}
