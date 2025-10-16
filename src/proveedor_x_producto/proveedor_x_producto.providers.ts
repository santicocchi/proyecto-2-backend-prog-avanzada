import { ProveedorXProductoRepository } from "./proveedor_x_producto.repository";

export const ProductoXProveedorProviders = [
    {
        provide: 'IProveedorXProductoRepository',
        useClass: ProveedorXProductoRepository,
    },    
];