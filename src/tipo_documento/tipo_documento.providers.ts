import { TipoDocumentoRepository } from './tipo_documento.repository';

export const  TipoDocumentoProviders = [
    {
        provide: 'ITipoDocumentoRepository',
        useClass: TipoDocumentoRepository,
    },
];