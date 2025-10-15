import { Marca } from "src/marca/entities/marca.entity";
import { Producto } from "src/producto/entities/producto.entity";
import { BaseEntity, Column, CreateDateColumn,  DeleteDateColumn,  Entity,  ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('linea')
export class Linea extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 150, unique: true })
    nombre: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    
    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToMany(() => Marca, marca => marca.lineas)
    marcas: Marca[];

    @OneToMany(() => Producto, producto => producto.linea)
    productos: Producto[];
}
