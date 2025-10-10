import { Marca } from "src/marca/entities/marca.entity";
import { BaseEntity, Column, CreateDateColumn,  Entity,  ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToMany(() => Marca, marca => marca.lineas)
    marcas: Marca[];
}
