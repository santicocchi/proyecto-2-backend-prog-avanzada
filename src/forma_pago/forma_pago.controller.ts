import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FormaPagoService } from './forma_pago.service';
import { CreateFormaPagoDto } from './dto/create-forma_pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma_pago.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';

@Controller('forma-pago')
export class FormaPagoController {
  constructor(private readonly formaPagoService: FormaPagoService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_FORMA_PAGO))
  @Post()
  create(@Body() createFormaPagoDto: CreateFormaPagoDto) {
    return this.formaPagoService.create(createFormaPagoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_FORMA_PAGO))
  @Get()
  findAll() {
    return this.formaPagoService.findAll();
  }


  @UseGuards(AuthGuardFactory(Permissions.OBTENER_FORMA_PAGO))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formaPagoService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_FORMA_PAGO))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormaPagoDto: UpdateFormaPagoDto) {
    return this.formaPagoService.update(+id, updateFormaPagoDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_FORMA_PAGO))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formaPagoService.remove(+id);
  }
}
