import { ProveedorRepository } from "./proveedor.repository";

export const ProveedorProviders = [
    {
        provide: 'IProveedorRepository',
        useClass: ProveedorRepository,
    },
];