import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { IVentaRepository } from './interface/IVentaRepository';
import { Cliente } from '../cliente/entities/cliente.entity';
import { FormaPago } from '../forma_pago/entities/forma_pago.entity';
import { DetalleVenta } from '../detalle_venta/entities/detalle_venta.entity';
import { UserEntity } from '../auth/users/entities/user.entity';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class VentaRepository implements IVentaRepository {
    constructor(
        @InjectRepository(Venta)
        private readonly ventaRepo: Repository<Venta>,
        @InjectRepository(Cliente)
        private readonly clienteRepo: Repository<Cliente>,
        @InjectRepository(FormaPago)
        private readonly formaPagoRepo: Repository<FormaPago>,
        @InjectRepository(DetalleVenta)
        private readonly detalleVentaRepo: Repository<DetalleVenta>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(Producto)
        private readonly productoRepo: Repository<Producto>,
        private readonly dataSource: DataSource,
    ) { }

    async create(data: any): Promise<Venta> {
        return await this.dataSource.transaction(async manager => {
            const cliente = await manager.findOne(Cliente, { where: { id: data.clienteId, deletedAt: IsNull() } });
            if (!cliente) throw new BadRequestException('Cliente no encontrado');
            const formaPago = await manager.findOne(FormaPago, { where: { id: data.formaPagoId, deletedAt: IsNull() } });
            if (!formaPago) throw new BadRequestException('Forma de pago no encontrada');
            const responsable = await manager.findOne(UserEntity, { where: { id: data.userId } });
            if (!responsable) throw new BadRequestException('Usuario responsable no encontrado');
            let total = 0;
            const detalles: DetalleVenta[] = [];
            for (const det of data.detallesVenta) {
                const producto = await manager.findOne(Producto, { where: { id: det.productoId, deletedAt: IsNull() } });
                if (!producto) throw new BadRequestException('Producto no encontrado');
                const subtotal = Number((det.cantidad * Number(producto.precio)).toFixed(2));
                const detalle = manager.create(DetalleVenta, {
                    cantidad: det.cantidad,
                    subtotal,
                    producto,
                });
                detalles.push(await manager.save(detalle));
                total += subtotal;
            }
            const venta = manager.create(Venta, {
                fecha_venta: data.fecha_venta,
                cliente,
                formaPago,
                responsable,
                detallesVenta: detalles,
                total,
            });
            return await manager.save(venta);
        });
    }

    async findAll(order: 'ASC' | 'DESC' = 'ASC'): Promise<Venta[]> {
        return await this.ventaRepo.find({
            where: { deletedAt: IsNull() },
            order: { fecha_venta: order },
            relations: ['cliente', 'formaPago', 'responsable', 'detallesVenta', 'detallesVenta.producto'],
        });
    }

    async findAdvanced(filter: any): Promise<Venta[]> {
        const qb = this.ventaRepo.createQueryBuilder('venta')
            .leftJoinAndSelect('venta.cliente', 'cliente')
            .leftJoinAndSelect('venta.formaPago', 'formaPago')
            .leftJoinAndSelect('venta.responsable', 'responsable')
            .leftJoinAndSelect('venta.detallesVenta', 'detallesVenta')
            .leftJoinAndSelect('detallesVenta.producto', 'producto')
            .where('venta.deletedAt IS NULL');
        if (filter.clienteId) qb.andWhere('cliente.id = :clienteId', { clienteId: filter.clienteId });
        if (filter.formaPagoId) qb.andWhere('formaPago.id = :formaPagoId', { formaPagoId: filter.formaPagoId });
        if (filter.userId) qb.andWhere('responsable.id = :userId', { userId: filter.userId });
        if (filter.total) qb.andWhere('venta.total = :total', { total: filter.total });
        return await qb.getMany();
    }

    async findOne(id: number): Promise<Venta> {
        return await this.ventaRepo.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['cliente', 'formaPago', 'responsable', 'detallesVenta', 'detallesVenta.producto'],
        });
    }

    async update(id: number, data: any): Promise<Venta> {
        // Implementar lógica de actualización de venta y detalles
        // Similar a create, pero actualizando los detalles existentes
        // y recalculando el total
        return this.findOne(id);
    }

    async softDelete(id: number): Promise<void> {
        const venta = await this.findOne(id);
        if (!venta) throw new NotFoundException('Venta no encontrada');
        await this.ventaRepo.update(id, { deletedAt: new Date() });
        for (const detalle of venta.detallesVenta) {
            await this.detalleVentaRepo.update(detalle.id, { deletedAt: new Date() });
        }
    }
}
