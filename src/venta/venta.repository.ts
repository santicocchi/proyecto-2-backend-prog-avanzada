//src/venta/venta.repository.ts
import {
  Injectable,
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IVentaRepository } from './interface/IVentaRepository';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { UpdateClienteDto } from 'src/cliente/dto/update-cliente.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentaRepository implements IVentaRepository {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepo: Repository<DetalleVenta>,
  ) { }

  //  Crear venta con transacción
  async create(data: Venta): Promise<Venta> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Guardar la venta
        const ventaEntity = manager.create(Venta, {
          fecha_venta: data.fecha_venta,
          cliente: data.cliente,
          formaPago: data.formaPago,
          responsable: data.responsable,
          total: data.total,
        });

        const ventaGuardada = await manager.save(Venta, ventaEntity);

        // Guardar los detalles asociados
        if (data.detallesVenta && data.detallesVenta.length > 0) {
          for (const det of data.detallesVenta) {
            det.ventas = ventaGuardada;
            await manager.save(DetalleVenta, det);
          }
        }

        // Retornar la venta completa con relaciones usando QueryBuilder
        return await manager
          .createQueryBuilder(Venta, 'venta')
          .leftJoinAndSelect('venta.cliente', 'cliente')
          .leftJoinAndSelect('venta.formaPago', 'formaPago')
          .leftJoinAndSelect('venta.responsable', 'responsable')
          .leftJoinAndSelect('venta.detallesVenta', 'detallesVenta')
          .leftJoinAndSelect('detallesVenta.producto', 'producto')
          .where('venta.id = :id', { id: ventaGuardada.id })
          .getOne();
      });
    } catch (error) {
      console.error('Error en transacción de venta:', error);
      throw new HttpException(
        error.message || 'Error al guardar la venta',
        error.status || 500,
      );
    }
  }

  // Obtener todas las ventas
  async findAll(order: 'ASC' | 'DESC' = 'ASC'): Promise<Venta[]> {
    try {
      return await this.ventaRepo
        .createQueryBuilder('venta')
        .leftJoinAndSelect('venta.cliente', 'cliente')
        .leftJoinAndSelect('venta.formaPago', 'formaPago')
        .leftJoinAndSelect('venta.responsable', 'responsable')
        .leftJoinAndSelect('venta.detallesVenta', 'detallesVenta')
        .leftJoinAndSelect('detallesVenta.producto', 'producto')
        .where('venta.deletedAt IS NULL')
        .orderBy('venta.fecha_venta', order)
        .getMany();
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      throw new HttpException('Error al obtener las ventas', 500);
    }
  }

  // Búsqueda avanzada con filtros
  async findAdvanced(filter: any): Promise<[Venta[], number]> {
    try {
      const qb = this.ventaRepo
        .createQueryBuilder('venta')
        .leftJoinAndSelect('venta.cliente', 'cliente')
        .leftJoinAndSelect('venta.formaPago', 'formaPago')
        .leftJoinAndSelect('venta.responsable', 'responsable')
        .leftJoinAndSelect('venta.detallesVenta', 'detallesVenta')
        .leftJoinAndSelect('detallesVenta.producto', 'producto')
        .where('venta.deletedAt IS NULL');
      if (filter.clienteId)
        qb.andWhere('cliente.id = :clienteId', { clienteId: filter.clienteId });
      if (filter.formaPagoId)
        qb.andWhere('formaPago.id = :formaPagoId', { formaPagoId: filter.formaPagoId });
      if (filter.userId)
        qb.andWhere('responsable.id = :userId', { userId: filter.userId });
      if (filter.total)
        qb.andWhere('venta.total = :total', { total: filter.total });

      const take = filter.take || 10;
      const skip = ((filter.page || 1) - 1) * take;

      qb.take(take).skip(skip).orderBy('venta.fecha_venta', 'DESC');

      return await qb.getManyAndCount();
    } catch (error) {
      throw new HttpException('Error al buscar ventas avanzadas', 500);
    }
  }

  // Buscar una venta por ID
  async findOne(id: number): Promise<Venta> {
    try {
      const venta = await this.ventaRepo
        .createQueryBuilder('venta')
        .leftJoinAndSelect('venta.cliente', 'cliente')
        .leftJoinAndSelect('cliente.tipo_documento', 'tipo_documento')
        .leftJoinAndSelect('venta.formaPago', 'formaPago')
        .leftJoinAndSelect('venta.responsable', 'responsable')
        .leftJoinAndSelect('venta.detallesVenta', 'detallesVenta')
        .leftJoinAndSelect('detallesVenta.producto', 'producto')
        .where('venta.id = :id', { id })
        .andWhere('venta.deletedAt IS NULL')
        .getOne();
      if (!venta) throw new NotFoundException('Venta no encontrada');
      return venta;
    } catch (error) {
      throw new HttpException('Error al buscar la venta', 500,);
    }
  }

  //Actualizar venta (por ahora mínima)
  async update(id: number, data: UpdateVentaDto): Promise<Venta> {
    try {
      const venta = await this.findOne(id);
      if (!venta) throw new NotFoundException('Venta no encontrada');

      // Merge de los nuevos datos
      const updated = Object.assign(venta, data);
      await this.ventaRepo.save(updated);

      return this.findOne(id);
    } catch (error) {
      throw new HttpException('Error al actualizar la venta', 500);
    }
  }

  // Eliminación lógica (venta y detalles)
  async softDelete(id: number): Promise<void> {
    try {
      const venta = await this.findOne(id);
      if (!venta) throw new NotFoundException('Venta no encontrada');

      // Marcar venta como eliminada usando QueryBuilder
      await this.ventaRepo
        .createQueryBuilder()
        .update(Venta)
        .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
        .where('id = :id', { id })
        .execute();

      // Marcar detalles como eliminados
      for (const detalle of venta.detallesVenta) {
        await this.detalleVentaRepo
          .createQueryBuilder()
          .update(DetalleVenta)
          .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
          .where('id = :id', { id: detalle.id })
          .execute();
      }
    }
    catch (error) {
      throw new HttpException('Error al eliminar la venta', 500);
    }
  }
}
