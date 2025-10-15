import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { DetalleVentaRepository } from './detalle_venta.repository';
import { DetalleVentaMapper } from './helpers/detalle_venta.mapper';

@Injectable()
export class DetalleVentaService {
  constructor(private readonly detalleVentaRepository: DetalleVentaRepository) {}

  async create(dto: CreateDetalleVentaDto) {
    try {
      const detalle = await this.detalleVentaRepository.create(dto);
      return DetalleVentaMapper.toResponse(detalle);
    } catch (error) {
      console.error('Error en DetalleVentaService.create:', error);
      throw new HttpException('Error al crear detalle de venta', 500);
    }
  }
  async findOne(id: number) {
    const detalle = await this.detalleVentaRepository.findOne(id);
    return DetalleVentaMapper.toResponse(detalle);
  }


  async update(id: number, dto: any) {
    const detalle = await this.detalleVentaRepository.update(id, dto);
    return DetalleVentaMapper.toResponse(detalle);
  }

  async remove(id: number) {
    await this.detalleVentaRepository.softDelete(id);
    return DetalleVentaMapper.toDeleteResponse(id);
  }
  
}
