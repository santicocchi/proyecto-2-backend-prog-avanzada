import { FormaPagoRepository } from "./forma_pago.repository";

export const FormaPagoProviders = [
    {
        provide: 'IFormaPagoRepository',
        useClass: FormaPagoRepository
    },
] 