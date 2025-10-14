import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";
import { Producto } from "./entities/producto.entity";
import { IProductoRepository } from "./interface/IProductoRepository";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Marca } from "../marca/entities/marca.entity";
import { ProveedorXProducto } from "../proveedor_x_producto/entities/proveedor_x_producto.entity";

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

    async create(dto: CreateProductoDto): Promise<Producto> {
        try {
            // Aquí deberías validar que la línea pertenezca a la marca seleccionada
            // y asociar correctamente la marca y la línea
            // ...
            // Por simplicidad, solo se asocia la marca
            const marca = await this.marcaRepo.findOne({ where: { id: dto.marcaId, deletedAt: null }, relations: ['lineas'] });
            if (!marca) throw new NotFoundException('Marca no encontrada');
            // Aquí podrías validar la línea si es necesario
            const producto = this.repo.create({
                nombre: dto.nombre,
                descripcion: dto.descripcion,
                precio: dto.precio,
                stock: dto.stock,
                marca: marca
            });
            return await this.repo.save(producto);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el producto');
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
            throw new InternalServerErrorException('Error al obtener los productos');
        }
    }

    async findById(id: number): Promise<Producto | null> {
        try {
            return await this.repo.findOne({
                where: { id, deletedAt: null },
                relations: ['marca', 'marca.lineas', 'proveedor_x_producto', 'proveedor_x_producto.proveedor']
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener el producto');
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
                const marca = await this.marcaRepo.findOne({ where: { id: dto.marcaId, deletedAt: null }, relations: ['lineas'] });
                if (!marca) throw new NotFoundException('Marca no encontrada');
                producto.marca = marca;
            }
            return await this.repo.save(producto);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el producto');
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
            throw new InternalServerErrorException('Error al eliminar el producto');
        }
    }

    async decreaseStock(id: number, cantidad: number): Promise<Producto | null> {
        try {
            const producto = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!producto) throw new NotFoundException('Producto no encontrado');
            producto.stock = Math.max(0, producto.stock - cantidad);
            return await this.repo.save(producto);
        } catch (error) {
            throw new InternalServerErrorException('Error al disminuir el stock');
        }
    }

    async advancedList(filters: any): Promise<Producto[]> {
        // Aquí deberías implementar los filtros avanzados usando query builder
        // ...
        return [];
    }
}
