import { Producto } from "src/producto/entities/producto.entity";
import { ProveedorXProducto } from "src/proveedor_x_producto/entities/proveedor_x_producto.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('proveedor')
export class Proveedor extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 , unique: true})
    nombre: string;

    @Column({ length: 150 })
    direccion: string;

    @Column({ unique: true, length: 20 })
    cuit: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @OneToMany(() => ProveedorXProducto, proveedor_x_producto => proveedor_x_producto.proveedor)
    proveedor_x_producto: ProveedorXProducto[];

}
