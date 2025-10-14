import { CreateLineaDto } from "../dto/create-linea.dto";
import { UpdateLineaDto } from "../dto/update-linea.dto";
import { Linea } from "../entities/linea.entity";

export interface ILineaRepository {
    findAll(): Promise<Linea[]>;
    findById(id: number): Promise<Linea | null>;
    create(data: CreateLineaDto): Promise<Linea>;
    update(id: number, linea: UpdateLineaDto): Promise<Linea | null>;
    softDelete(id: number): Promise<boolean>;
}
