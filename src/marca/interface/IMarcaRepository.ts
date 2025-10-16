import { CreateMarcaDto } from "../dto/create-marca.dto";
import { UpdateMarcaDto } from "../dto/update-marca.dto";
import { Marca } from "../entities/marca.entity";

export interface IMarcaRepository {
    findAll(): Promise<Marca[]>;
    findById(id: number): Promise<Marca | null>;
    create(data: CreateMarcaDto): Promise<Marca>;
    update(id: number, marca: UpdateMarcaDto): Promise<Marca | null>;
    softDelete(id: number): Promise<boolean>;
    // Persistence helpers; business logic (assign/remove) lives in the service
    getMarcaWithLineas(marcaId: number): Promise<Marca | null>;
    getLineaById(lineaId: number): Promise<import('../../linea/entities/linea.entity').Linea | null>;
    saveMarca(marca: Marca): Promise<Marca>;
}
