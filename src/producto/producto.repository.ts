// src/producto/producto.repository.ts
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { Producto } from "./entities/producto.entity";
import { IProductoRepository } from "./interface/IProductoRepository";
import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Marca } from "../marca/entities/marca.entity";
import { ProveedorXProducto } from "../proveedor_x_producto/entities/proveedor_x_producto.entity";
import { Linea } from "src/linea/entities/linea.entity";

@Injectable()
export class ProductoRepository implements IProductoRepository {
    constructor(
        @InjectRepository(Producto)
        private readonly repo: Repository<Producto>,
        @InjectRepository(Marca)
        private readonly marcaRepo: Repository<Marca>,
        @InjectRepository(ProveedorXProducto)
        private readonly pxpRepo: Repository<ProveedorXProducto>
    ) { }

    async create(data: {
        nombre: string;
        descripcion: string;
        precio_sin_impuesto: number;
        stock: number;
        impuesto: number;
        precio_con_impuesto: number;
        marca: Marca;
        linea: Linea;
    }): Promise<Producto> {
        try {
            const producto = this.repo.create(data);
            return await this.repo.save(producto);
        } catch (error) {
            throw new HttpException('Error al crear el producto', 500);
        }
    }

    async findAll(): Promise<Producto[]> {
        try {
            return await this.repo
                .createQueryBuilder('producto')
                .leftJoinAndSelect('producto.marca', 'marca')
                .leftJoinAndSelect('producto.linea', 'linea')
                .leftJoinAndSelect('producto.proveedor_x_producto', 'pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .where('producto.deletedAt IS NULL')
                .orderBy('producto.id', 'ASC')
                .getMany();
        } catch (error) {
            throw new HttpException('Error al obtener los productos', 500);
        }
    }

    async findById(id: number): Promise<Producto | null> {
        try {
            const producto = await this.repo
                .createQueryBuilder('producto')
                .leftJoinAndSelect('producto.marca', 'marca')
                .leftJoinAndSelect('producto.linea', 'linea')
                .leftJoinAndSelect('producto.proveedor_x_producto', 'pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .where('producto.id = :id', { id })
                .andWhere('producto.deletedAt IS NULL')
                .getOne();

            return producto || null;
        } catch (error) {
            throw new HttpException('Error al obtener el producto', 500);
        }
    }

    async update(id: number, dto: UpdateProductoDto): Promise<Producto | null> {
        try {
            const producto = await this.repo
                .createQueryBuilder('producto')
                .leftJoinAndSelect('producto.marca', 'marca')
                .leftJoinAndSelect('producto.linea', 'linea')
                .leftJoinAndSelect('producto.proveedor_x_producto', 'pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .where('producto.id = :id', { id })
                .andWhere('producto.deletedAt IS NULL')
                .getOne();

            if (!producto) return null;
            if (dto.nombre) producto.nombre = dto.nombre;
            if (dto.descripcion) producto.descripcion = dto.descripcion;
            if (dto.precio) producto.precio_sin_impuesto = dto.precio;
            producto.precio_con_impuesto = producto.precio_sin_impuesto * (1 + 21 / 100);
            if (dto.stock) producto.stock = dto.stock;
            // Si se quiere cambiar la marca, validar y asignar
            if (dto.marcaId) {
                const marca = await this.marcaRepo.findOne({ where: { id: dto.marcaId.id, deletedAt: null }, relations: ['lineas'] });
                if (!marca) throw new NotFoundException('Marca no encontrada');
                producto.marca = marca;
            }
            return await this.repo.save(producto);
        } catch (error) {
            throw new HttpException('Error al actualizar el producto', 500);
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const producto = await this.repo
                .createQueryBuilder('producto')
                .where('producto.id = :id', { id })
                .andWhere('producto.deletedAt IS NULL')
                .getOne();

            if (!producto) throw new NotFoundException('Producto no encontrado');

            await this.repo
                .createQueryBuilder()
                .update(Producto)
                .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
                .where('id = :id', { id })
                .execute();

            return true;
        } catch (error) {
            throw new HttpException('Error al eliminar el producto', 500);
        }
    }

    async decreaseStock(id: number, cantidad: number): Promise<Producto | null> {
        try {
            const producto = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!producto) throw new NotFoundException('Producto no encontrado');
            producto.stock = producto.stock - cantidad
            return await this.repo.save(producto);
        } catch (error) {
            throw new HttpException('Error al disminuir el stock del producto', 500);
        }
    }

    async advancedList(filters: any): Promise<[Producto[], number]> {
        try {
            const qb = this.repo
                .createQueryBuilder('producto')
                .leftJoinAndSelect('producto.marca', 'marca')
                .leftJoinAndSelect('producto.linea', 'linea')
                .leftJoinAndSelect('producto.proveedor_x_producto', 'pxp')
                .leftJoinAndSelect('pxp.proveedor', 'proveedor')
                .where('producto.deletedAt IS NULL');

            //Filtrar por marca
            if (filters.marcaId) {
                qb.andWhere('marca.id = :marcaId', { marcaId: filters.marcaId });
            }

            //Filtrar por proveedor
            if (filters.proveedorId) {
                qb.andWhere('proveedor.id = :proveedorId', { proveedorId: filters.proveedorId });
            }

            //Filtrar por línea
            if (filters.lineaId) {
                qb.andWhere('linea.id = :lineaId', { lineaId: filters.lineaId });
            }

            //Filtrar por stock (rango)
            if (filters.stockDesde !== undefined) {
                qb.andWhere('producto.stock >= :stockDesde', { stockDesde: filters.stockDesde });
            }
            if (filters.stockHasta !== undefined) {
                qb.andWhere('producto.stock <= :stockHasta', { stockHasta: filters.stockHasta });
            }

            //Filtrar por precio (rango)
            if (filters.precioDesde !== undefined) {
                qb.andWhere('producto.precio >= :precioDesde', { precioDesde: filters.precioDesde });
            }
            if (filters.precioHasta !== undefined) {
                qb.andWhere('producto.precio <= :precioHasta', { precioHasta: filters.precioHasta });
            }

            //Filtrar por código de proveedor
            if (filters.codigoProveedor) {
                qb.andWhere('LOWER(pxp.codigo_proveedor) LIKE :codigo', {
                    codigo: `%${filters.codigoProveedor.toLowerCase()}%`,
                });
            }

            // Paginación
            const take = filters.take || 10;
            const page = filters.page || 1;
            const skip = (page - 1) * take;

            qb.take(take).skip(skip).orderBy('producto.nombre', 'ASC');

            return await qb.getManyAndCount();
        } catch (error) {
            console.error('Error en búsqueda avanzada de productos:', error);
            throw new HttpException('Error al obtener productos filtrados', 500);
        }
    }

}
