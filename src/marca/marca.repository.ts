import { CreateMarcaDto } from "./dto/create-marca.dto";
import { UpdateMarcaDto } from "./dto/update-marca.dto";
import { Marca } from "./entities/marca.entity";
import { IMarcaRepository } from "./interface/IMarcaRepository";
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Linea } from "../linea/entities/linea.entity";

@Injectable()
export class MarcaRepository implements IMarcaRepository {
    constructor(
        @InjectRepository(Marca)
        private readonly repo: Repository<Marca>,
        @InjectRepository(Linea)
        private readonly lineaRepo: Repository<Linea>
    ) {}

    async create(dto: CreateMarcaDto): Promise<Marca> {
        try {
            const { nombre, lineas } = dto;
            const marca = this.repo.create({ nombre });
            if (lineas && lineas.length > 0) {
                const lineasEntities = await this.lineaRepo.findByIds(lineas);
                marca.lineas = lineasEntities;
            }
            return await this.repo.save(marca);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la marca');
        }
    }

    async findAll(): Promise<Marca[]> {
        try {
            return await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.deletedAt IS NULL')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener las marcas');
        }
    }

    async findById(id: number): Promise<Marca | null> {
        try {
            return await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.id = :id', { id })
                .andWhere('marca.deletedAt IS NULL')
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la marca');
        }
    }

    async update(id: number, dto: UpdateMarcaDto): Promise<Marca | null> {
        try {
            const marca = await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.id = :id', { id })
                .andWhere('marca.deletedAt IS NULL')
                .getOne();
            if (!marca) return null;
            if (dto.nombre) marca.nombre = dto.nombre;
            if (dto.lineas) {
                const lineasEntities = await this.lineaRepo.findByIds(dto.lineas);
                marca.lineas = lineasEntities;
            }
            return await this.repo.save(marca);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la marca');
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const marca = await this.repo.createQueryBuilder('marca')
                .where('marca.id = :id', { id })
                .andWhere('marca.deletedAt IS NULL')
                .getOne();
            if (!marca) throw new NotFoundException('Marca no encontrada');
            marca.deletedAt = new Date();
            await this.repo.save(marca);
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la marca');
        }
    }

    async assignLinea(marcaId: number, lineaId: number): Promise<{ success: boolean; message: string }> {
        try {
            const marca = await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.id = :marcaId', { marcaId })
                .andWhere('marca.deletedAt IS NULL')
                .getOne();
            if (!marca) throw new NotFoundException('Marca no encontrada');
            const linea = await this.lineaRepo.findOne({ where: { id: lineaId, deletedAt: null } });
            if (!linea) throw new NotFoundException('Linea no encontrada');
            if (marca.lineas && marca.lineas.some(l => l.id === linea.id)) {
                return { success: false, message: `La linea ${linea.nombre} ya está asignada a la marca ${marca.nombre}` };
            }
            marca.lineas = [...(marca.lineas || []), linea];
            await this.repo.save(marca);
            return { success: true, message: `La linea ${linea.nombre} fue asignada a la marca ${marca.nombre} con exito` };
        } catch (error) {
            throw new HttpException('Error al asignar la línea a la marca', 500);
        }
    }
    
    async removeLinea(marcaId: number, lineaId: number): Promise<{ success: boolean; message: string }> {
        try {
            const marca = await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.id = :marcaId', { marcaId })
                .andWhere('marca.deletedAt IS NULL')
                .getOne();
            if (!marca) throw new NotFoundException('Marca no encontrada');
            const linea = await this.lineaRepo.findOne({ where: { id: lineaId, deletedAt: null } });
            if (!linea) throw new NotFoundException('Linea no encontrada');
            if (!marca.lineas || !marca.lineas.some(l => l.id === linea.id)) {
                return { success: false, message: `La linea ${linea.nombre} no está asignada a la marca ${marca.nombre}` };
            }
            marca.lineas = marca.lineas.filter(l => l.id !== linea.id);
            await this.repo.save(marca);
            return { success: true, message: `La linea ${linea.nombre} fue eliminada de la marca ${marca.nombre} con exito` };
        } catch (error) {
            throw new HttpException('Error al eliminar la línea de la marca', 500);
        }
    }
}
