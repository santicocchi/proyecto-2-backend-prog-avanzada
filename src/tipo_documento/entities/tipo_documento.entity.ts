import { Cliente } from "src/cliente/entities/cliente.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tipo_documento')
export class TipoDocumento extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, unique: true})
    nombre: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Cliente, cliente => cliente.tipo_documento)
    clientes: Cliente[];
}
