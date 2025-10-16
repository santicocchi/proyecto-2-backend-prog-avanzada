import { CreateProveedorXProductoDto } from "./dto/create-proveedor_x_producto.dto";
import { UpdateProveedorXProductoDto } from "./dto/update-proveedor_x_producto.dto";
import { ProveedorXProducto } from "./entities/proveedor_x_producto.entity";
import { IProveedorXProductoRepository } from "./interface/IProveedorXProductoRepository";
import { Injectable, NotFoundException, BadRequestException, HttpException, InternalServerErrorException } from "@nestjs/common";
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
            if (!proveedor) throw new HttpException('Proveedor no encontrado', 404);
            const producto = await this.productoRepo.findOne({ where: { id: dto.productoId, deletedAt: null } });
            if (!producto) throw new HttpException('Producto no encontrado', 404);
            // Verificar existencia previa
            const existe = await this.repo.findOne({ where: { proveedor: { id: proveedor.id }, producto: { id: producto.id }, deletedAt: null } });
            if (existe) throw new HttpException('La relación proveedor-producto ya existe', 400);
            const pxp = this.repo.create({
                proveedor,
                producto,
                precio_proveedor: dto.precio_proveedor,
                codigo_proveedor: dto.codigo_proveedor
            });
            return await this.repo.save(pxp);
        } catch (error) {
            throw error instanceof BadRequestException || error instanceof NotFoundException ? error : new HttpException('Error al crear la relación proveedor-producto', 500);
        }
    }

    async findAll(): Promise<ProveedorXProducto[]> {
        try {
            return await this.repo
                .createQueryBuilder('pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .leftJoinAndSelect('pxp.producto', 'producto')
                .where('pxp.deletedAt IS NULL')
                .orderBy('pxp.id', 'ASC')
                .getMany();
        } catch (error) {
            throw new HttpException('Error al obtener las relaciones proveedor-producto', 500);
        }
    }

    async findById(id: number): Promise<ProveedorXProducto | null> {
        try {
            const pxp = await this.repo
                .createQueryBuilder('pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .leftJoinAndSelect('pxp.producto', 'producto')
                .where('pxp.id = :id', { id })
                .andWhere('pxp.deletedAt IS NULL')
                .getOne();

            return pxp || null;
        } catch (error) {
            throw new HttpException('Error al obtener la relación proveedor-producto', 500);
        }
    }

    async update(id: number, dto: UpdateProveedorXProductoDto): Promise<ProveedorXProducto | null> {
        try {
            const pxp = await this.repo
                .createQueryBuilder('pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .leftJoinAndSelect('pxp.producto', 'producto')
                .where('pxp.id = :id', { id })
                .andWhere('pxp.deletedAt IS NULL')
                .getOne();
            if (!pxp) return null;
            if (dto.precio_proveedor) pxp.precio_proveedor = dto.precio_proveedor;
            if (dto.codigo_proveedor) pxp.codigo_proveedor = dto.codigo_proveedor;
            // No se permite cambiar proveedor/producto por integridad
            return await this.repo.save(pxp);
        } catch (error) {
            throw new HttpException('Error al actualizar la relación proveedor-producto', 500);
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const pxp = await this.repo
                .createQueryBuilder('pxp')
                .where('pxp.id = :id', { id })
                .andWhere('pxp.deletedAt IS NULL')
                .getOne();

            if (!pxp) throw new HttpException('Relación proveedor-producto no encontrada', 404);

            await this.repo
                .createQueryBuilder()
                .update(ProveedorXProducto)
                .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
                .where('id = :id', { id })
                .execute();

            return true;
        } catch (error) {
            throw new HttpException('Error al eliminar la relación proveedor-producto', 500);
        }
    }
}
