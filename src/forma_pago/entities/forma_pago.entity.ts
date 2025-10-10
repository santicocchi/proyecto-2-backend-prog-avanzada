import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Venta } from "../../venta/entities/venta.entity";

@Entity('forma_pago')
export class FormaPago extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    nombre: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Venta, (venta) => venta.formaPago)
    ventas: Venta[];
}
