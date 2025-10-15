// src/producto/interface/IProducto.ts
export interface IProducto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    marca?: any;
    linea?: any;
    proveedores?: any[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
