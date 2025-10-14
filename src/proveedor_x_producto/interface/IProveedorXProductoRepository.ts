import { CreateProveedorXProductoDto } from "../dto/create-proveedor_x_producto.dto";
import { UpdateProveedorXProductoDto } from "../dto/update-proveedor_x_producto.dto";
import { ProveedorXProducto } from "../entities/proveedor_x_producto.entity";

export interface IProveedorXProductoRepository {
    findAll(): Promise<ProveedorXProducto[]>;
    findById(id: number): Promise<ProveedorXProducto | null>;
    create(data: CreateProveedorXProductoDto): Promise<ProveedorXProducto>;
    update(id: number, proveedorXProducto: UpdateProveedorXProductoDto): Promise<ProveedorXProducto | null>;
    softDelete(id: number): Promise<boolean>;
}
