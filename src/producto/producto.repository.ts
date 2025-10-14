import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { Producto } from "./entities/producto.entity";
import { IProductoRepository } from "./interface/IProductoRepository";
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
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
    ) {}

    async create(data: {
        nombre: string;
        descripcion: string;
        precio: number;
        stock: number;
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

    async findAll(options?: any): Promise<Producto[]> {
        try {
            // Aquí puedes agregar filtros y ordenamientos según options
            return await this.repo.find({
                where: { deletedAt: null },
                relations: ['marca', 'marca.lineas', 'proveedor_x_producto', 'proveedor_x_producto.proveedor']
            });
        } catch (error) {
            throw new HttpException('Error al obtener los productos', 500);
        }
    }

    async findById(id: number): Promise<Producto | null> {
        try {
            return await this.repo.findOne({
                where: { id, deletedAt: null },
                relations: ['marca', 'marca.lineas', 'proveedor_x_producto', 'proveedor_x_producto.proveedor']
            });
        } catch (error) {
            throw new HttpException('Error al obtener el producto', 500);
        }
    }

    async update(id: number, dto: UpdateProductoDto): Promise<Producto | null> {
        try {
            const producto = await this.repo.findOne({ where: { id, deletedAt: null }, relations: ['marca', 'marca.lineas', 'proveedor_x_producto', 'proveedor_x_producto.proveedor'] });
            if (!producto) return null;
            if (dto.nombre) producto.nombre = dto.nombre;
            if (dto.descripcion) producto.descripcion = dto.descripcion;
            if (dto.precio) producto.precio = dto.precio;
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
            const producto = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!producto) throw new NotFoundException('Producto no encontrado');
            producto.deletedAt = new Date();
            await this.repo.save(producto);
            return true;
        } catch (error) {
            throw new HttpException('Error al eliminar el producto', 500);
        }
    }

    async decreaseStock(id: number, cantidad: number): Promise<Producto | null> {
        try {
            const producto = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!producto) throw new NotFoundException('Producto no encontrado');
            producto.stock = Math.max(0, producto.stock - cantidad);
            return await this.repo.save(producto);
        } catch (error) {
            throw new HttpException('Error al disminuir el stock del producto', 500);
        }
    }

    async advancedList(filters: any): Promise<Producto[]> {
        // Aquí deberías implementar los filtros avanzados usando query builder
        // ...
        return [];
    }
}
