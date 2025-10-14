import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { AuthGuardFactory } from 'src/middleware/auth.middleware';
import { Permissions } from 'src/auth/permissions.enum';
import { ValidarCuitPipe } from 'src/common/helpers/pipes/validar-cuit.pipe';


@Controller('proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @UseGuards(AuthGuardFactory(Permissions.CREAR_PROVEEDOR))
  @Post()
  // ValidarCuitPipe
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.LISTAR_PROVEEDORES))
  @Get()
  findAll() {
    return this.proveedorService.findAll();
  }

  @UseGuards(AuthGuardFactory(Permissions.OBTENER_PROVEEDOR))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedorService.findOne(+id);
  }

  @UseGuards(AuthGuardFactory(Permissions.EDITAR_PROVEEDOR))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorService.update(+id, updateProveedorDto);
  }

  @UseGuards(AuthGuardFactory(Permissions.ELIMINAR_PROVEEDOR))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proveedorService.remove(+id);
  }
}
