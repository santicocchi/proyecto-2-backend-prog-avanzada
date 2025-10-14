import { Linea } from "src/linea/entities/linea.entity";
import { Producto } from "src/producto/entities/producto.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('marca')
export class Marca extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ length: 100, unique: true })
    nombre: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @ManyToMany(() => Linea, linea => linea.marcas)
    @JoinColumn( { name: 'linea_id' } )
    lineas: Linea[];

    @OneToMany(() => Producto, (producto) => producto.marca)
    productos: Producto[];
}
