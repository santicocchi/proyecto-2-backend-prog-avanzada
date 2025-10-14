export interface IProveedor {
    id: number;
    nombre: string;
    direccion: string;
    cuit: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
