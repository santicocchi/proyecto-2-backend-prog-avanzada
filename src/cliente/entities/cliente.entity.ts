import { TipoDocumento } from 'src/tipo_documento/entities/tipo_documento.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinTable, OneToMany } from 'typeorm';

@Entity('cliente')
export class Cliente extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nombre: string;

    @Column({ length: 50 })
    apellido: string;

    @Column({ length: 20, unique: true })
    num_documento: string;

    @Column({ length: 50 })
    telefono: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => TipoDocumento, (tipo_documento) => tipo_documento.clientes)
    tipo_documento: TipoDocumento;

    @OneToMany(() => Venta, (venta) => venta.cliente)
    ventas: Venta[];
}
