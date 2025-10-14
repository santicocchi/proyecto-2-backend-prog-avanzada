import { DetalleVenta } from "src/detalle_venta/entities/detalle_venta.entity";
import { Marca } from "src/marca/entities/marca.entity";
import { Proveedor } from "src/proveedor/entities/proveedor.entity";
import { ProveedorXProducto } from "src/proveedor_x_producto/entities/proveedor_x_producto.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('producto')
export class Producto extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column({ length: 100 })
    nombre: string;

    @Column({ length: 150 })
    descripcion: string;

    @Column('decimal', { precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int' })
    stock: number;
    
    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @OneToMany(() => ProveedorXProducto, proveedor_x_producto => proveedor_x_producto.producto)
    proveedor_x_producto: ProveedorXProducto[];

    @ManyToOne(() => Marca, marca => marca.productos)
    marca: Marca;

    @OneToMany(() => DetalleVenta, detalle_venta => detalle_venta.producto)
    detalleVentas: DetalleVenta[];
}
