import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Cliente } from "src/cliente/entities/cliente.entity";
import { FormaPago } from "src/forma_pago/entities/forma_pago.entity";
import { DetalleVenta } from "src/detalle_venta/entities/detalle_venta.entity";
import { UserEntity } from "src/auth/users/entities/user.entity";

@Entity('venta')
export class Venta extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha_venta: Date;

    @Column()
    total: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Cliente, cliente => cliente.ventas)
    cliente: Cliente;

    @ManyToOne(() => FormaPago, formaPago => formaPago.ventas)
    formaPago: FormaPago;
    
    @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.ventas)
    detallesVenta: DetalleVenta[];


    @ManyToOne(() => UserEntity)
    responsable: UserEntity;

    @Column({ nullable: true })
    deletedAt: Date;

}
