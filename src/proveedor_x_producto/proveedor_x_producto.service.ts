import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorXProductoDto } from './dto/create-proveedor_x_producto.dto';
import { UpdateProveedorXProductoDto } from './dto/update-proveedor_x_producto.dto';
import { IProveedorXProductoRepository } from './interface/IProveedorXProductoRepository';
import { ProveedorXProductoMapper } from './helpers/proveedor_x_producto.mapper';

@Injectable()
export class ProveedorXProductoService {
  constructor(
    @Inject('IProveedorXProductoRepository')
    private readonly pxpRepository: IProveedorXProductoRepository
  ) {}

  async create(createDto: CreateProveedorXProductoDto) {
    const pxp = await this.pxpRepository.create(createDto);
    return ProveedorXProductoMapper.toCreateResponse(pxp);
  }

  async findAll() {
    const pxps = await this.pxpRepository.findAll();
    return ProveedorXProductoMapper.toListResponse(pxps);
  }

  async findOne(id: number) {
    const pxp = await this.pxpRepository.findById(id);
    if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
    return ProveedorXProductoMapper.toResponse(pxp);
  }

  async update(id: number, updateDto: UpdateProveedorXProductoDto) {
    const pxp = await this.pxpRepository.update(id, updateDto);
    if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
    return ProveedorXProductoMapper.toResponse(pxp);
  }

  async remove(id: number) {
    const pxp = await this.pxpRepository.findById(id);
    if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
    await this.pxpRepository.softDelete(id);
    return ProveedorXProductoMapper.toDeleteResponse(pxp);
  }
}
