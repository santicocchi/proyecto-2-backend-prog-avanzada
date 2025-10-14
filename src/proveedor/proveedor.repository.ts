import { CreateProveedorDto } from "./dto/create-proveedor.dto";
import { UpdateProveedorDto } from "./dto/update-proveedor.dto";
import { Proveedor } from "./entities/proveedor.entity";
import { IProveedorRepository } from "./interface/IProveedorRepository";
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ProveedorRepository implements IProveedorRepository {
    constructor(
        @InjectRepository(Proveedor)
        private readonly repo: Repository<Proveedor>
    ) {}

    async create(dto: CreateProveedorDto): Promise<Proveedor> {
        try {
            const proveedor = this.repo.create(dto);
            return await this.repo.save(proveedor);
        } catch (error) {
            throw new  HttpException('Error al crear el proveedor', 500);
        }
    }

    async findAll(): Promise<Proveedor[]> {
        try {
            return await this.repo.find({ where: { deletedAt: null } });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los proveedores');
        }
    }

    async findById(id: number): Promise<Proveedor | null> {
        try {
            return await this.repo.findOne({ where: { id, deletedAt: null } });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener el proveedor');
        }
    }

    async update(id: number, dto: UpdateProveedorDto): Promise<Proveedor | null> {
        try {
            const proveedor = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!proveedor) return null;
            if (dto.nombre) proveedor.nombre = dto.nombre;
            if (dto.direccion) proveedor.direccion = dto.direccion;
            if (dto.cuit) proveedor.cuit = dto.cuit;
            return await this.repo.save(proveedor);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el proveedor');
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const proveedor = await this.repo.findOne({ where: { id, deletedAt: null } });
            if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
            proveedor.deletedAt = new Date();
            await this.repo.save(proveedor);
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el proveedor');
        }
    }
}
