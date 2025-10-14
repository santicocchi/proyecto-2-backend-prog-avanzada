import { Producto } from "src/producto/entities/producto.entity";
import { Proveedor } from "src/proveedor/entities/proveedor.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('proveedor_x_producto')
export class ProveedorXProducto extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Proveedor, proveedor => proveedor.proveedor_x_producto, { eager: true })
    proveedor: Proveedor;
   
    @ManyToOne(() => Producto, producto => producto.proveedor_x_producto, { eager: true })
    producto: Producto;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_proveedor: number;

    @Column({ length: 50 })
    codigo_proveedor: string;

    @Column({ nullable: true })
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
