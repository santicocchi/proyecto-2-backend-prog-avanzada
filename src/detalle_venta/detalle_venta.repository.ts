import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { IDetalleVentaRepository } from './interface/IDetalleVentaRepository';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class DetalleVentaRepository implements IDetalleVentaRepository {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepo: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async create(data: any): Promise<DetalleVenta> {
    const producto = await this.productoRepo.findOne({ where: { id: data.productoId, deletedAt: IsNull() } });
    if (!producto) throw new BadRequestException('Producto no encontrado');
    const subtotal = this.calcularSubtotal(data.cantidad, producto.precio);
    const detalle = this.detalleVentaRepo.create({
      cantidad: data.cantidad,
      subtotal,
      producto,
    });
    return await this.detalleVentaRepo.save(detalle);
  }

  async findOne(id: number): Promise<DetalleVenta> {
    return await this.detalleVentaRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['producto'],
    });
  }

  async update(id: number, data: any): Promise<DetalleVenta> {
    const detalle = await this.findOne(id);
    if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
    let producto = detalle.producto;
    if (data.productoId && data.productoId !== producto.id) {
      producto = await this.productoRepo.findOne({ where: { id: data.productoId, deletedAt: IsNull() } });
      if (!producto) throw new BadRequestException('Producto no encontrado');
    }
    const subtotal = this.calcularSubtotal(data.cantidad ?? detalle.cantidad, producto.precio);
    await this.detalleVentaRepo.update(id, {
      cantidad: data.cantidad ?? detalle.cantidad,
      subtotal,
      producto,
    });
    return this.findOne(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.detalleVentaRepo.update(id, { deletedAt: new Date() });
  }

  private calcularSubtotal(cantidad: number, precio: number): number {
    return Number((cantidad * precio).toFixed(2));
  }
}
