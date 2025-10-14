import { Injectable, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { IDetalleVentaRepository } from './interface/IDetalleVentaRepository';
import { Producto } from '../producto/entities/producto.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';

@Injectable()
export class DetalleVentaRepository implements IDetalleVentaRepository {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepo: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
  ) { }

  async create(data: CreateDetalleVentaDto): Promise<DetalleVenta> {
    try {
      const producto = await this.productoRepo.findOne({
        where: { id: data.productoId, deletedAt: IsNull() },
      });
      if (!producto) throw new BadRequestException('Producto no encontrado');

      // Si se pasa ventaId (opcional)
      let venta: Venta = null;
      if (data.ventaId) {
        venta = await this.ventaRepo.findOne({
          where: { id: data.ventaId, deletedAt: IsNull() },
        });
        if (!venta) throw new BadRequestException('Venta no encontrada');
      }

      const subtotal = this.calcularSubtotal(data.cantidad, producto.precio);

      const detalle = this.detalleVentaRepo.create({
        cantidad: data.cantidad,
        subtotal,
        producto,
        ventas: venta,
      });

      return await this.detalleVentaRepo.save(detalle);
    } catch (error) {
      console.error('Error al crear detalle de venta:', error);
      throw new HttpException('Error al crear el detalle de venta', 500);
    }
  }

  async findOne(id: number): Promise<DetalleVenta> {
    try {
      const detalle = await this.detalleVentaRepo.findOne({
        where: { id, deletedAt: IsNull() },
        relations: ['producto', 'venta'],
      });
      if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
      return detalle;
    } catch (error) {
      console.error('Error al buscar detalle de venta:', error);
      throw new HttpException('Error al buscar el detalle de venta', 500);
    }
  }


  async update(id: number, data: Partial<CreateDetalleVentaDto>): Promise<DetalleVenta> {
    try {
      const detalle = await this.findOne(id);
      if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');

      let producto = detalle.producto;
      if (data.productoId && data.productoId !== producto.id) {
        producto = await this.productoRepo.findOne({
          where: { id: data.productoId, deletedAt: IsNull() },
        });
        if (!producto) throw new BadRequestException('Producto no encontrado');
      }

      const subtotal = this.calcularSubtotal(
        data.cantidad ?? detalle.cantidad,
        producto.precio,
      );

      await this.detalleVentaRepo.update(id, {
        cantidad: data.cantidad ?? detalle.cantidad,
        subtotal,
        producto,
      });

      return this.findOne(id);
    } catch (error) {
      console.error('Error al actualizar detalle de venta:', error);
      throw new HttpException('Error al actualizar el detalle de venta', 500);
    }
  }

  async softDelete(id: number): Promise<void> {
    try {
      const detalle = await this.findOne(id);
      if (!detalle) throw new NotFoundException('Detalle de venta no encontrado');
      await this.detalleVentaRepo.update(id, { deletedAt: new Date() });
    } catch (error) {
      console.error('Error al eliminar detalle de venta:', error);
      throw new HttpException('Error al eliminar el detalle de venta', 500);
    }
  }


  private calcularSubtotal(cantidad: number, precio: number): number {
    try {
      return Number((cantidad * precio).toFixed(2));
    } catch (error) {
      console.error('Error al calcular subtotal:', error);
      throw new HttpException('Error al calcular el subtotal', 500);
    }
  }
}
