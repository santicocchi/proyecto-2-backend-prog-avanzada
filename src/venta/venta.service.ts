import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { VentaRepository } from './venta.repository';
import { VentaMapper } from './helpers/venta.mapper';

@Injectable()
export class VentaService {
  constructor(private readonly ventaRepository: VentaRepository) {}

  async create(createVentaDto: CreateVentaDto) {
    const venta = await this.ventaRepository.create(createVentaDto);
    return VentaMapper.toResponse(venta);
  }

  async findAll(order: 'ASC' | 'DESC' = 'ASC') {
    const ventas = await this.ventaRepository.findAll(order);
    return VentaMapper.toListResponse(ventas);
  }

  async findAdvanced(filter: any) {
    const ventas = await this.ventaRepository.findAdvanced(filter);
    return VentaMapper.toListResponse(ventas);
  }

  async findOne(id: number) {
    const venta = await this.ventaRepository.findOne(id);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return VentaMapper.toResponse(venta);
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    const venta = await this.ventaRepository.update(id, updateVentaDto);
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return VentaMapper.toResponse(venta);
  }

  async remove(id: number) {
    await this.ventaRepository.softDelete(id);
    return VentaMapper.toDeleteResponse(id);
  }
}
