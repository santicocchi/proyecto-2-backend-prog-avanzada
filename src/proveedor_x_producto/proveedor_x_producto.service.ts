import { Inject, Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { CreateProveedorXProductoDto } from './dto/create-proveedor_x_producto.dto';
import { UpdateProveedorXProductoDto } from './dto/update-proveedor_x_producto.dto';
import { IProveedorXProductoRepository } from './interface/IProveedorXProductoRepository';
import { ProveedorXProductoMapper } from './helpers/proveedor_x_producto.mapper';

@Injectable()
export class ProveedorXProductoService {
  constructor(
    @Inject('IProveedorXProductoRepository')
    private readonly pxpRepository: IProveedorXProductoRepository
  ) { }

  async create(createDto: CreateProveedorXProductoDto) {
    try {
      const pxp = await this.pxpRepository.create(createDto);
      return ProveedorXProductoMapper.toCreateResponse(pxp);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear la relación proveedor-producto', 500);
    }
  }

  async findAll() {
    try {
      const pxps = await this.pxpRepository.findAll();
      return ProveedorXProductoMapper.toListResponse(pxps);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener las relaciones proveedor-producto', 500);
    }
  }

  async findOne(id: number) {
    try {
      const pxp = await this.pxpRepository.findById(id);
      if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
      return ProveedorXProductoMapper.toResponse(pxp);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener la relación proveedor-producto', 500);
    }
  }

  async update(id: number, updateDto: UpdateProveedorXProductoDto) {
    try {
      const pxp = await this.pxpRepository.update(id, updateDto);
      if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
      return ProveedorXProductoMapper.toResponse(pxp);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar la relación proveedor-producto', 500);
    }
  }

  async remove(id: number) {
    try {
      const pxp = await this.pxpRepository.findById(id);
      if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
      await this.pxpRepository.softDelete(id);
      return ProveedorXProductoMapper.toDeleteResponse(pxp);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al eliminar la relación proveedor-producto', 500);
    }
  }
}
