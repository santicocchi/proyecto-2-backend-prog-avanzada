import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TipoDocumentoService } from './tipo_documento.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tipos de Documento')
@Controller('tipo-documento')
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_TIPO_DOCUMENTO))
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de documento', description: 'Permite crear un nuevo tipo de documento en el sistema.' })
  @ApiBody({ description: 'Información del tipo de documento a crear.',type: CreateTipoDocumentoDto, 
    examples: {
    ejemplo1: { summary: 'Ejemplo 1',value: {nombre: 'DNI'}},
    ejemplo2: { summary: 'Ejemplo 2',value: {nombre: 'Pasaporte'}},}})
  async create(@Body() createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return this.tipoDocumentoService.create(createTipoDocumentoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_TIPOS_DOCUMENTO))
  @Get()
  findAll() {
    return this.tipoDocumentoService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_TIPO_DOCUMENTO))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoDocumentoService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_TIPO_DOCUMENTO))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto) {
    return this.tipoDocumentoService.update(+id, updateTipoDocumentoDto);
  }

  // @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_TIPO_DOCUMENTO))
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tipoDocumentoService.remove(+id);
  // }
  
}
