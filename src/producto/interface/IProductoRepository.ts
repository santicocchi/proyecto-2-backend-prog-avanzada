import { CreateProductoDto } from "../dto/create-producto.dto";
import { UpdateProductoDto } from "../dto/update-producto.dto";
import { Producto } from "../entities/producto.entity";

export interface IProductoRepository {
    findAll(options?: any): Promise<Producto[]>;
    findById(id: number): Promise<Producto | null>;
    create(data: CreateProductoDto): Promise<Producto>;
    update(id: number, producto: UpdateProductoDto): Promise<Producto | null>;
    softDelete(id: number): Promise<boolean>;
    decreaseStock(id: number, cantidad: number): Promise<Producto | null>;
    advancedList(filters: any): Promise<Producto[]>;
}
