export interface IProveedorXProducto {
    id: number;
    producto: any;
    proveedor: any;
    precio_proveedor: number;
    codigo_proveedor: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
