import {
  Injectable,
  NotFoundException,
  HttpException,
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
  ) {}

  //  Crear venta con transacción
  async create(data: Venta): Promise<Venta> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Guardar primero los detalles
        const detallesGuardados: DetalleVenta[] = [];

        for (const det of data.detallesVenta) {
          const savedDet = await manager.save(DetalleVenta, det);
          detallesGuardados.push(savedDet);
        }

        // Crear la venta con los detalles persistidos
        const ventaEntity = manager.create(Venta, {
          ...data,
          detallesVenta: detallesGuardados,
        });

        const ventaGuardada = await manager.save(Venta, ventaEntity);
        return ventaGuardada;
      });
    } catch (error) {
      console.error('Error en transacción de venta:', error);
      throw new HttpException('Error al guardar la venta', 500);
    }
  }

  // Obtener todas las ventas
  async findAll(order: 'ASC' | 'DESC' = 'ASC'): Promise<Venta[]> {
    return await this.ventaRepo.find({
      where: { deletedAt: IsNull() },
      order: { fecha_venta: order },
      relations: [
        'cliente',
        'formaPago',
        'responsable',
        'detallesVenta',
        'detallesVenta.producto',
      ],
    });
  }

  // Búsqueda avanzada con filtros
  async findAdvanced(filter: any): Promise<Venta[]> {
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

    return await qb.getMany();
  }

  // Buscar una venta por ID
  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: [
        'cliente',
        'formaPago',
        'responsable',
        'detallesVenta',
        'detallesVenta.producto',
      ],
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    return venta;
  }

  //Actualizar venta (por ahora mínima)
  async update(id: number, data: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    if (!venta) throw new NotFoundException('Venta no encontrada');

    // Merge de los nuevos datos
    const updated = Object.assign(venta, data);
    await this.ventaRepo.save(updated);

    return this.findOne(id);
  }

  // Eliminación lógica (venta y detalles)
  async softDelete(id: number): Promise<void> {
    const venta = await this.findOne(id);
    if (!venta) throw new NotFoundException('Venta no encontrada');

    // Marcar venta como eliminada
    await this.ventaRepo.update(id, { deletedAt: new Date() });

    // Marcar detalles como eliminados
    for (const detalle of venta.detallesVenta) {
      await this.detalleVentaRepo.update(detalle.id, { deletedAt: new Date() });
    }
  }
}
