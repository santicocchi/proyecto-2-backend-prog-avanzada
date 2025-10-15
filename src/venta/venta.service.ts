import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { VentaMapper } from './helpers/venta.mapper';
import { IVentaRepository } from './interface/IVentaRepository';
import { IClienteRepository } from 'src/cliente/interface/IClienteRepository';
import { IFormaPagoRepository } from 'src/forma_pago/interface/IFormaPagoRepository';
import { IUserRepository } from 'src/auth/users/iUsersRepository.interface';
import { IProductoRepository } from 'src/producto/interface/IProductoRepository';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { Venta } from './entities/venta.entity';
import { FindAdvancedDto } from './dto/find-advanced.dto';

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
    @Inject('IProductoRepository')
    private readonly productoRepo: IProductoRepository,

  ) { }

  async create(dto: CreateVentaDto) {
    try {
      // 1️⃣ Buscar entidades base
      const cliente = await this.clienteRepo.findOne(dto.clienteId);
      if (!cliente) throw new NotFoundException('Cliente no encontrado');

      const formaPago = await this.formaPagoRepo.findOne(dto.formaPagoId);
      if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');

      const responsable = await this.userRepo.findOneById(dto.userId);
      if (!responsable) throw new NotFoundException('Usuario responsable no encontrado');

      // 2️⃣ Preparar detalles de venta
      const detalles: DetalleVenta[] = [];
      let total = 0;

      for (const det of dto.detallesVenta) {
        const producto = await this.productoRepo.findById(det.productoId);
        if (!producto)
          throw new BadRequestException(
            `Producto con ID ${det.productoId} no encontrado`,
          );

        const subtotal = Number((det.cantidad * Number(producto.precio)).toFixed(2));

        const detalle = new DetalleVenta();
        detalle.cantidad = det.cantidad;
        detalle.subtotal = subtotal;
        detalle.producto = producto;

        detalles.push(detalle);
        total += subtotal;
      }

      // 3️⃣ Crear la venta (a nivel de dominio)
      const venta = new Venta();
      venta.fecha_venta = dto.fecha_venta;
      venta.cliente = cliente;
      venta.formaPago = formaPago;
      venta.responsable = responsable;
      venta.detallesVenta = detalles;
      venta.total = total;

      // 4️⃣ Persistir en la base
      const ventaCreada = await this.ventaRepository.create(venta);

      // 5️⃣ Mapear respuesta
      return VentaMapper.toResponse(ventaCreada);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException)
        throw error;
      console.error(error);
      throw new HttpException('Error interno del servidor', 500);
    }
  }

  async findAll(order: 'ASC' | 'DESC' = 'ASC') {
    const ventas = await this.ventaRepository.findAll(order);
    return VentaMapper.toListResponse(ventas);
  }

  async findAdvanced(filter: FindAdvancedDto) {


    // Validaciones: si el filtro incluye ids referenciales, verificar que existan
    try {
      if (filter?.clienteId) {
        const cliente = await this.clienteRepo.findOne(filter.clienteId);
        if (!cliente) throw new NotFoundException('Cliente no encontrado');
      }

      if (filter?.formaPagoId) {
        const formaPago = await this.formaPagoRepo.findOne(filter.formaPagoId);
        if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
      }

      if (filter?.userId) {
        const responsable = await this.userRepo.findOneById(filter.userId);
        if (!responsable) throw new NotFoundException('Usuario responsable no encontrado');
      }

      const ventas = await this.ventaRepository.findAdvanced(filter);
      return VentaMapper.toListResponse(ventas);
    }
    catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new HttpException('Error interno del servidor', 500);
    }
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
