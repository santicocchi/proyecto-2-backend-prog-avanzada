import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { DetalleVentaMapper } from './interface/detalle_venta.mapper';
import { IDetalleVentaRepository } from './interface/IDetalleVentaRepository';
import { CreateDetalleVentaInput } from 'src/venta/dto/create-venta.dto';
import { EntityManager, In } from 'typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { IProducto } from 'src/producto/interface/IProducto';
import { IProductoRepository } from 'src/producto/interface/IProductoRepository';

@Injectable()
export class DetalleVentaService {
  constructor(
    @Inject('IDetalleVentaRepository')
    private readonly detalleVentaRepository: IDetalleVentaRepository,
    @Inject('IProductoRepository')
    private readonly productoRepo: IProductoRepository
  
  ) { }

  async crearDetalles(detallesInput: CreateDetalleVentaInput[], manager: EntityManager): Promise<{ detalles: DetalleVenta[], total: number }> {
    try {
    const detalles: DetalleVenta[] = [];
    let total = 0;

    for (const det of detallesInput) {
      const producto = await EntityExistsValidator.validate(
        this.productoRepo.findById(det.productoId),
        `Producto con ID ${det.productoId}`,
      );

      // Verificar stock
      // if (producto.stock < det.cantidad) {
      //   throw new BadRequestException(
      //     `Stock insuficiente para el producto "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${det.cantidad}`,
      //   );
      // }

      // Calcular subtotal
      const subtotal = Number((det.cantidad * Number(producto.precio_con_impuesto)).toFixed(2));

      // Disminuir stock dentro del mismo manager (para mantener atomicidad)
      producto.stock -= det.cantidad;
      await manager.save(producto);

      // Crear el detalle de venta
      const detalle = manager.create(DetalleVenta, {
        cantidad: det.cantidad,
        subtotal,
        producto,
      });

      detalles.push(detalle);
      total += subtotal;
    }

    return { detalles, total };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al crear los detalles de venta', 500);
    }
  }

  async findOne(id: number) {
    try {
      const detalle = await this.detalleVentaRepository.findOne(id);
      return DetalleVentaMapper.toResponse(detalle);
    } catch (error) {
      throw new HttpException('Error al obtener el detalle de venta', 500);
    }
  }


  async update(id: number, dto: any) {
    try {
      const detalle = await this.detalleVentaRepository.update(id, dto);
      return DetalleVentaMapper.toResponse(detalle);
    } catch (error) {
      throw new HttpException('Error al actualizar el detalle de venta', 500);
    }
  }

  async remove(id: number) {
    try {
      await this.detalleVentaRepository.softDelete(id);
      return DetalleVentaMapper.toDeleteResponse(id);
    } catch (error) {
      throw new HttpException('Error al eliminar el detalle de venta', 500);
    }
  }

}
