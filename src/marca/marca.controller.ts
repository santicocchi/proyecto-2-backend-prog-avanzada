import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';
import { LineaMarcaDto } from './dto/linea-marca.dto';

@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_MARCA))
  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_MARCAS))
  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_MARCAS))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcaService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_MARCA))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.update(+id, updateMarcaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_MARCA))
  @Post(':id/marcas/assign-linea')
  assignLinea(@Param('id') id: string, @Body() body: LineaMarcaDto) {
    return this.marcaService.assignLinea(+id, body.lineaId);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_MARCA))
  @Delete(':id/marcas/delete-linea')
  removeLinea(@Param('id') id: string, @Body() body: LineaMarcaDto) {
    return this.marcaService.removeLinea(+id, body.lineaId);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_MARCA))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaService.remove(+id);
  }
}
