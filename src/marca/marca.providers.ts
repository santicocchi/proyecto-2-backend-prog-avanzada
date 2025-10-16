import { MarcaRepository } from "./marca.repository";

// marca.providers.ts
export const MarcaProviders = [
  {
    provide: 'IMarcaRepository',
    useClass: MarcaRepository,
  },
];
