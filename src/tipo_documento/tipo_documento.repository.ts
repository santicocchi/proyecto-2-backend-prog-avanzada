import { Injectable, InternalServerErrorException } from "@nestjs/common";
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
            throw new InternalServerErrorException('Error al crear el tipo de documento');
        }
    }

    async findAll(): Promise<TipoDocumento[]> {
        try {
            return await this.repo.find();
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener los tipos de documento');
        }
    }

    async findById(id: number): Promise<TipoDocumento | null> {
        try {
            return await this.repo.findOne({ where: { id } });
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener el tipo de documento');
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
            throw new InternalServerErrorException('Error al actualizar el tipo de documento');
        }
    }


}