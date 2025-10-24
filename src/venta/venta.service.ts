//src/venta/venta.service.ts
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { VentaMapper } from './interface/venta.mapper';
import { IVentaRepository } from './interface/IVentaRepository';
import { IClienteRepository } from 'src/cliente/interface/IClienteRepository';
import { IFormaPagoRepository } from 'src/forma_pago/interface/IFormaPagoRepository';
import { IUserRepository } from 'src/auth/users/iUsersRepository.interface';
import { IProductoRepository } from 'src/producto/interface/IProductoRepository';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { Venta } from './entities/venta.entity';
import { FindAdvancedDto } from './dto/find-advanced.dto';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { DataSource } from 'typeorm';
import { DetalleVentaService } from 'src/detalle_venta/detalle_venta.service';

@Injectable()
export class VentaService {
  constructor(
    @Inject('IVentaRepository')
    private readonly ventaRepository: IVentaRepository,
    @Inject('IClienteRepository')
    private readonly clienteRepo: IClienteRepository,
    @Inject('IFormaPagoRepository')
    private readonly formaPagoRepo: IFormaPagoRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    private readonly detalleVentaService: DetalleVentaService,
    private readonly dataSource: DataSource

  ) { }

  async create(dto: CreateVentaDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Buscar entidades base
        const cliente = await EntityExistsValidator.validate(
          this.clienteRepo.findOne(dto.clienteId),
          'Cliente',
        );

        const formaPago = await EntityExistsValidator.validate(
          this.formaPagoRepo.findOne(dto.formaPagoId),
          'Forma de pago',
        );

        const responsable = await EntityExistsValidator.validate(
          this.userRepo.findOneById(dto.userId),
          'Usuario responsable',
        );

        // Crear los detalles a través del servicio especializado
        const { detalles, total } = await this.detalleVentaService.crearDetalles(
          dto.detallesVenta,
          manager,
        );

        // 3️⃣ Crear la venta (entidad principal)
        const venta = manager.create(Venta, {
          fecha_venta: dto.fecha_venta,
          cliente,
          formaPago,
          responsable,
          total,
        });

        // 4️⃣ Guardar venta primero (sin detalles aún)
        const ventaGuardada = await manager.save(Venta, venta);

        // 5️⃣ Asociar los detalles creados a la venta
        for (const det of detalles) {
          det.ventas = ventaGuardada;
          await manager.save(DetalleVenta, det);
        }

        // 6️⃣ Cargar la venta final con sus relaciones
        const ventaFinal = await manager.findOne(Venta, {
          where: { id: ventaGuardada.id },
          relations: [
            'cliente',
            'formaPago',
            'responsable',
            'detallesVenta',
            'detallesVenta.producto',
          ],
        });

        return VentaMapper.toCreateResponse(ventaFinal);
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;

      console.error('Error en la creación de la venta:', error);
      throw new HttpException('Error interno del servidor', 500);
    }
  }
  // async findAll(order: 'ASC' | 'DESC' = 'ASC') {
  //   const ventas = await this.ventaRepository.findAll(order);
  //   return VentaMapper.toListResponse(ventas);
  // }

  async findAdvanced(filter: FindAdvancedDto): Promise<{ data: any[]; total: number }> {
    try {
      if (filter?.clienteId)
        await EntityExistsValidator.validate(this.clienteRepo.findOne(filter.clienteId), 'Cliente');

      if (filter?.formaPagoId)
        await EntityExistsValidator.validate(this.formaPagoRepo.findOne(filter.formaPagoId), 'Forma de pago');

      if (filter?.userId)
        await EntityExistsValidator.validate(this.userRepo.findOneById(filter.userId), 'Usuario responsable');

      const [ventas, total] = await this.ventaRepository.findAdvanced(filter);

      return {
        data: VentaMapper.toListResponse(ventas),
        total: total,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Error interno del servidor', 500);
    }
  }

  async findOne(id: number) {
    try {
      const venta = await this.ventaRepository.findOne(id);
      if (!venta) throw new NotFoundException('Venta no encontrada');
      return VentaMapper.toResponse(venta);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno del servidor', 500);
    }
  }

  // async update(id: number, updateVentaDto: UpdateVentaDto) {
  //   try {
  //     const venta = await this.ventaRepository.update(id, updateVentaDto);
  //     if (!venta) throw new NotFoundException('Venta no encontrada');
  //     return VentaMapper.toResponse(venta);
  //   } catch (error) {
  //     if (error instanceof HttpException) throw error;

  //     throw new HttpException('Error interno del servidor', 500);
  //   }
  // }

  async remove(id: number) {
    try {
      await this.ventaRepository.softDelete(id);
      return VentaMapper.toDeleteResponse(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException('Error interno del servidor', 500);
    }
  }
}
