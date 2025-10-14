import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { DetalleVentaRepository } from './detalle_venta.repository';
import { DetalleVentaMapper } from './helpers/detalle_venta.mapper';

@Injectable()
export class DetalleVentaService {
  constructor(private readonly detalleVentaRepository: DetalleVentaRepository) {}

  async create(createDetalleVentaDto: CreateDetalleVentaDto) {
    const detalle = await this.detalleVentaRepository.create(createDetalleVentaDto);
    return DetalleVentaMapper.toResponse(detalle);
  }

  async findOne(id: number) {
    const detalle = await this.detalleVentaRepository.findOne(id);
    if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
    return DetalleVentaMapper.toResponse(detalle);
  }

  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto) {
    const detalle = await this.detalleVentaRepository.update(id, updateDetalleVentaDto);
    if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
    return DetalleVentaMapper.toResponse(detalle);
  }

  async remove(id: number) {
    await this.detalleVentaRepository.softDelete(id);
    return DetalleVentaMapper.toDeleteResponse(id);
  }
}
