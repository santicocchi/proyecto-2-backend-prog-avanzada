import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_CLIENTE))
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_CLIENTES))
  @Get()
  findAll(@Query() query: any) {
    return this.clienteService.findAll(query);
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_CLIENTE))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clienteService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_CLIENTE))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(+id, updateClienteDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_CLIENTE))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clienteService.remove(+id);
  }
}
