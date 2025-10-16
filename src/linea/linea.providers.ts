import { LineaRepository } from "./linea.repository";

export const LineaProviders = [
    {
        provide: 'ILineaRepository',
        useClass: LineaRepository
    }
];

