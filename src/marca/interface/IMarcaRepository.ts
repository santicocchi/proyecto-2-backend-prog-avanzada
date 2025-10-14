import { CreateMarcaDto } from "../dto/create-marca.dto";
import { UpdateMarcaDto } from "../dto/update-marca.dto";
import { Marca } from "../entities/marca.entity";

export interface IMarcaRepository {
    findAll(): Promise<Marca[]>;
    findById(id: number): Promise<Marca | null>;
    create(data: CreateMarcaDto): Promise<Marca>;
    update(id: number, marca: UpdateMarcaDto): Promise<Marca | null>;
    softDelete(id: number): Promise<boolean>;
    assignLinea(marcaId: number, lineaId: number): Promise<{ success: boolean; message: string }>;
    removeLinea(marcaId: number, lineaId: number): Promise<{ success: boolean; message: string }>;
}
