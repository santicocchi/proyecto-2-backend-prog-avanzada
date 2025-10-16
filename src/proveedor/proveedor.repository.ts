import { CreateProveedorDto } from "./dto/create-proveedor.dto";
import { UpdateProveedorDto } from "./dto/update-proveedor.dto";
import { Proveedor } from "./entities/proveedor.entity";
import { IProveedorRepository } from "./interface/IProveedorRepository";
import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
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
            return await this.repo
                .createQueryBuilder('proveedor')
                .where('proveedor.deletedAt IS NULL')
                .orderBy('proveedor.id', 'ASC')
                .getMany();
        } catch (error) {
            throw new HttpException('Error al obtener los proveedores', 500);
        }
    }

    async findById(id: number): Promise<Proveedor | null> {
        try {
            const proveedor = await this.repo
                .createQueryBuilder('proveedor')
                .where('proveedor.id = :id', { id })
                .andWhere('proveedor.deletedAt IS NULL')
                .getOne();

            return proveedor || null;
        } catch (error) {
            throw new HttpException('Error al obtener el proveedor', 500);
        }
    }

    async update(id: number, dto: UpdateProveedorDto): Promise<Proveedor | null> {
        try {
            const proveedor = await this.repo
                .createQueryBuilder('proveedor')
                .where('proveedor.id = :id', { id })
                .andWhere('proveedor.deletedAt IS NULL')
                .getOne();
            if (!proveedor) return null;
            if (dto.nombre) proveedor.nombre = dto.nombre;
            if (dto.direccion) proveedor.direccion = dto.direccion;
            if (dto.cuit) proveedor.cuit = dto.cuit;
            return await this.repo.save(proveedor);
        } catch (error) {
            throw new HttpException('Error al actualizar el proveedor', 500);
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const proveedor = await this.repo
                .createQueryBuilder('proveedor')
                .where('proveedor.id = :id', { id })
                .andWhere('proveedor.deletedAt IS NULL')
                .getOne();

            if (!proveedor) throw new NotFoundException('Proveedor no encontrado');

            await this.repo
                .createQueryBuilder()
                .update(Proveedor)
                .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
                .where('id = :id', { id })
                .execute();

            return true;
        } catch (error) {
            throw new HttpException('Error al eliminar el proveedor', 500);
        }
    }
}
