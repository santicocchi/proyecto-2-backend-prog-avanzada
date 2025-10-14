import { CreateProveedorXProductoDto } from "./dto/create-proveedor_x_producto.dto";
import { UpdateProveedorXProductoDto } from "./dto/update-proveedor_x_producto.dto";
import { ProveedorXProducto } from "./entities/proveedor_x_producto.entity";
import { IProveedorXProductoRepository } from "./interface/IProveedorXProductoRepository";
import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Proveedor } from "../proveedor/entities/proveedor.entity";
import { Producto } from "../producto/entities/producto.entity";

@Injectable()
export class ProveedorXProductoRepository implements IProveedorXProductoRepository {
    constructor(
        @InjectRepository(ProveedorXProducto)
        private readonly repo: Repository<ProveedorXProducto>,
        @InjectRepository(Proveedor)
        private readonly proveedorRepo: Repository<Proveedor>,
        @InjectRepository(Producto)
        private readonly productoRepo: Repository<Producto>
    ) {}

    async create(dto: CreateProveedorXProductoDto): Promise<ProveedorXProducto> {
        try {
            const proveedor = await this.proveedorRepo.findOne({ where: { id: dto.proveedorId, deletedAt: null } });
            if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
            const producto = await this.productoRepo.findOne({ where: { id: dto.productoId, deletedAt: null } });
            if (!producto) throw new NotFoundException('Producto no encontrado');
            // Verificar existencia previa
            const existe = await this.repo.findOne({ where: { proveedor: { id: proveedor.id }, producto: { id: producto.id }, deletedAt: null } });
            if (existe) throw new BadRequestException('Ya existe la relación proveedor-producto');
            const pxp = this.repo.create({
                proveedor,
                producto,
                precio_proveedor: dto.precio_proveedor,
                codigo_proveedor: dto.codigo_proveedor
            });
            return await this.repo.save(pxp);
        } catch (error) {
            throw error instanceof BadRequestException || error instanceof NotFoundException ? error : new InternalServerErrorException('Error al crear la relación proveedor-producto');
        }
    }

    async findAll(): Promise<ProveedorXProducto[]> {
        try {
            return await this.repo.find({ where: { deletedAt: null }, relations: ['proveedor', 'producto'] });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las relaciones proveedor-producto');
        }
    }

    async findById(id: number): Promise<ProveedorXProducto | null> {
        try {
            return await this.repo.findOne({ where: { id, deletedAt: null }, relations: ['proveedor', 'producto'] });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la relación proveedor-producto');
        }
    }

    async update(id: number, dto: UpdateProveedorXProductoDto): Promise<ProveedorXProducto | null> {
        try {
            const pxp = await this.repo.findOne({ where: { id, deletedAt: null }, relations: ['proveedor', 'producto'] });
            if (!pxp) return null;
            if (dto.precio_proveedor) pxp.precio_proveedor = dto.precio_proveedor;
            if (dto.codigo_proveedor) pxp.codigo_proveedor = dto.codigo_proveedor;
            // No se permite cambiar proveedor/producto por integridad
            return await this.repo.save(pxp);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la relación proveedor-producto');
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const pxp = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!pxp) throw new NotFoundException('Relación proveedor-producto no encontrada');
            pxp.deletedAt = new Date();
            await this.repo.save(pxp);
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la relación proveedor-producto');
        }
    }
}
