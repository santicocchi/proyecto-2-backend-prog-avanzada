import { ClienteRepository } from "./cliente.repository";

export const ClienteProviders = [
    { provide: 'IClienteRepository', useClass: ClienteRepository }
];