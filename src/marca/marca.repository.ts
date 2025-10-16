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
            throw new HttpException('Error al crear la marca', 500);
        }
    }

    async findAll(): Promise<Marca[]> {
        try {
            return await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.deletedAt IS NULL')
                .getMany();
        } catch (error) {
            throw new HttpException('Error al obtener las marcas', 500);
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
            throw new HttpException('Error al obtener la marca', 500);
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
            throw new HttpException('Error al actualizar la marca', 500);
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
            throw new HttpException('Error al eliminar la marca', 500);
        }
    }
    // Persistence helpers used by the service
    async getMarcaWithLineas(marcaId: number): Promise<Marca | null> {
        try {
            return await this.repo.createQueryBuilder('marca')
                .leftJoinAndSelect('marca.lineas', 'linea')
                .where('marca.id = :id', { id: marcaId })
                .andWhere('marca.deletedAt IS NULL')
                .getOne();
        } catch (error) {
            throw new HttpException('Error al obtener la marca', 500);
        }
    }

    async getLineaById(lineaId: number): Promise<Linea | null> {
        try {
            return await this.lineaRepo.findOne({ where: { id: lineaId, deletedAt: null } });
        } catch (error) {
            throw new HttpException('Error al obtener la linea', 500);
        }
    }

    async saveMarca(marca: Marca): Promise<Marca> {
        try {
            return await this.repo.save(marca);
        } catch (error) {
            throw new HttpException('Error al guardar la marca', 500);
        }
    }
}
