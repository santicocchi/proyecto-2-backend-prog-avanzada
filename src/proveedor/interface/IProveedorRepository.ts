import { CreateProveedorDto } from "../dto/create-proveedor.dto";
import { UpdateProveedorDto } from "../dto/update-proveedor.dto";
import { Proveedor } from "../entities/proveedor.entity";

export interface IProveedorRepository {
    findAll(): Promise<Proveedor[]>;
    findById(id: number): Promise<Proveedor | null>;
    create(data: CreateProveedorDto): Promise<Proveedor>;
    update(id: number, proveedor: UpdateProveedorDto): Promise<Proveedor | null>;
    softDelete(id: number): Promise<boolean>;
}
