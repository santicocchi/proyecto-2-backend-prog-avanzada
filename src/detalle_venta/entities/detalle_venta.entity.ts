import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { Producto } from "../../producto/entities/producto.entity";
import { Venta } from "../../venta/entities/venta.entity";  

@Entity('detalle_venta')
export class DetalleVenta extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'int' })
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Producto, producto => producto.detalleVentas)
    producto: Producto;

    @ManyToOne(() => Venta, venta => venta.detallesVenta)
    ventas: Venta;
}
