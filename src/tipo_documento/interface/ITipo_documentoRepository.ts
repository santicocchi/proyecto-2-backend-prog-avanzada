import { CreateTipoDocumentoDto } from "../dto/create-tipo_documento.dto";
import { UpdateTipoDocumentoDto } from "../dto/update-tipo_documento.dto";
import { TipoDocumento } from "../entities/tipo_documento.entity";
import { ITipoDocumento } from "./ITipo_documento";

export interface ITipoDocumentoRepository {
    findAll(): Promise<TipoDocumento[]>;
    findById(id: number): Promise<TipoDocumento | null>;
    create(data: CreateTipoDocumentoDto): Promise<TipoDocumento>;
    update(id: number, tipoDocumento: UpdateTipoDocumentoDto): Promise<TipoDocumento | null>;
    // delete(id: number): Promise<boolean>;
}