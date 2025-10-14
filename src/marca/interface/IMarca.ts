import { CreateMarcaDto } from "../dto/create-marca.dto";
import { UpdateMarcaDto } from "../dto/update-marca.dto";

export interface IMarca {
    id: number;
    nombre: string;
    lineas?: any[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
