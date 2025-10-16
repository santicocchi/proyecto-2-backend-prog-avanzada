import { DetalleVentaRepository } from "./detalle_venta.repository";

export const DetalleVentaProviders = [
    {
        provide: 'IDetalleVentaRepository',
        useClass: DetalleVentaRepository
    }
];