import { VentaRepository } from './venta.repository';

export const VentaProviders = [
    {
        provide: 'IVentaRepository',
        useClass: VentaRepository,
    },
];