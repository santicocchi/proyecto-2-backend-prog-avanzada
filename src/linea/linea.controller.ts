import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('linea')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_LINEA))
  @Post()
  create(@Body() createLineaDto: CreateLineaDto) {
    return this.lineaService.create(createLineaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_LINEAS))
  @Get()
  findAll() {
    return this.lineaService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_LINEA))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineaService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_LINEA))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLineaDto: UpdateLineaDto) {
    return this.lineaService.update(+id, updateLineaDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_LINEA))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineaService.remove(+id);
  }
}
