import { ProductoRepository } from "./producto.repository";

export const ProductoProviders = [
    {
        provide: 'IProductoRepository',
        useClass: ProductoRepository,
    },
];