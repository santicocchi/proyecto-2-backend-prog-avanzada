import { CreateLineaDto } from "./dto/create-linea.dto";
import { UpdateLineaDto } from "./dto/update-linea.dto";
import { Linea } from "./entities/linea.entity";
import { ILineaRepository } from "./interface/ILineaRepository";
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Marca } from "../marca/entities/marca.entity";

@Injectable()
export class LineaRepository implements ILineaRepository {
    constructor(
        @InjectRepository(Linea)
        private readonly repo: Repository<Linea>,
        @InjectRepository(Marca)
        private readonly marcaRepo: Repository<Marca>
    ) {}

    async create(dto: CreateLineaDto): Promise<Linea> {
        try {
            const { nombre } = dto;
            const linea = this.repo.create({ nombre });
            return await this.repo.save(linea);
        } catch (error) {
            throw new HttpException('Error al crear la línea', 500);
        }
    }

    async findAll(): Promise<Linea[]> {
        try {
            return await this.repo.createQueryBuilder('linea')
                .leftJoinAndSelect('linea.marcas', 'marca')
                .where('linea.deletedAt IS NULL')
                .getMany();
        } catch (error) {
            throw new HttpException('Error al obtener las líneas', 500);
        }
    }

    async findById(id: number): Promise<Linea | null> {
        try {
            return await this.repo.createQueryBuilder('linea')
                .leftJoinAndSelect('linea.marcas', 'marca')
                .where('linea.id = :id', { id })
                .andWhere('linea.deletedAt IS NULL')
                .getOne();
        } catch (error) {
            throw new HttpException('Error al obtener la línea', 500);
        }
    }

    async update(id: number, dto: UpdateLineaDto): Promise<Linea | null> {
        try {
            const linea = await this.repo.createQueryBuilder('linea')
                .leftJoinAndSelect('linea.marcas', 'marca')
                .where('linea.id = :id', { id })
                .andWhere('linea.deletedAt IS NULL')
                .getOne();
            if (!linea) return null;
            if (dto.nombre) linea.nombre = dto.nombre;
            return await this.repo.save(linea);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la línea');
        }
    }

    async softDelete(id: number): Promise<boolean> {
        try {
            const linea = await this.repo.createQueryBuilder('linea')
                .where('linea.id = :id', { id })
                .andWhere('linea.deletedAt IS NULL')
                .getOne();
            if (!linea) throw new NotFoundException('Línea no encontrada');
            (linea as any).deletedAt = new Date();
            await this.repo.save(linea);
            return true;
        } catch (error) {
            throw new HttpException('Error al eliminar la línea', error.status || 500);
        }
    }
}
