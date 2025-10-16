import { Injectable, HttpException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TipoDocumento } from "./entities/tipo_documento.entity";
import { CreateTipoDocumentoDto } from "./dto/create-tipo_documento.dto";
import { ITipoDocumentoRepository } from "./interface/ITipo_documentoRepository";
import { In, Repository } from "typeorm";
import { UpdateTipoDocumentoDto } from "./dto/update-tipo_documento.dto";

@Injectable()
export class TipoDocumentoRepository implements ITipoDocumentoRepository{
    constructor(
        @InjectRepository(TipoDocumento)
        private readonly repo: Repository<TipoDocumento>
    ) {}

    async create(dto: CreateTipoDocumentoDto): Promise<TipoDocumento> {
        try {
            const entity = this.repo.create(dto);
            return await this.repo.save(entity);
        } catch (error) {
            throw new HttpException('Error al crear el tipo de documento', 500);
        }
    }

    async findAll(): Promise<TipoDocumento[]> {
        try {
            return await this.repo.find();
        } catch (error) {
            throw new HttpException('Error al obtener los tipos de documento', 500);
        }
    }

    async findById(id: number): Promise<TipoDocumento | null> {
        try {
            return await this.repo.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException('Error al obtener el tipo de documento', 500);
        }
    }

    async update(id: number, dto: UpdateTipoDocumentoDto): Promise<TipoDocumento | null> {
        try {
            const entity = await this.repo.findOne({ where: { id } });
            if (!entity) {
                return null;
            }
            this.repo.merge(entity, dto);
            return await this.repo.save(entity);
        } catch (error) {
            throw new HttpException('Error al actualizar el tipo de documento', 500);
        }
    }


}