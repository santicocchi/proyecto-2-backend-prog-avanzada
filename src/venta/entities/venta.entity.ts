import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Cliente } from "src/cliente/entities/cliente.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { FormaPago } from "src/forma_pago/entities/forma_pago.entity";
import { DetalleVenta } from "src/detalle_venta/entities/detalle_venta.entity";

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

    // @ManyToOne(() => Usuario, usuario => usuario.ventas)
    // usuario: Usuario;

    @ManyToOne(() => FormaPago, formaPago => formaPago.ventas)
    formaPago: FormaPago;
    
    @OneToMany(() => DetalleVenta, detalleVenta => detalleVenta.ventas)
    detallesVenta: DetalleVenta[];

}
