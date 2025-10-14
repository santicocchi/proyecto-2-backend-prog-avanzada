import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, IsNull, Not } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { IClienteRepository } from './interface/IClienteRepository';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClienteRepository implements IClienteRepository {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepo: Repository<Cliente>,
    ) { }

    async create(@Body() dto: CreateClienteDto): Promise<Cliente> {
        try {
            // Validar que no exista un cliente con el mismo tipo y número de documento
            const existe = await this.clienteRepo.findOne({
                where: {
                    tipo_documento: dto.tipo_documento,
                    num_documento: dto.num_documento,
                    deletedAt: IsNull(),
                },
            });
            if (existe) {
                throw new HttpException(
                    'Ya existe un cliente con ese tipo y número de documento',
                    400,
                );
            }
            const cliente = this.clienteRepo.create(dto);
            await this.clienteRepo.save(cliente);
            // Opcional: recargar para devolver el objeto actualizado
            return await this.findOne(cliente.id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Error al crear el cliente', 500);
        }
    }

    async findAll(filter: any): Promise<Cliente[]> {
        try {
            const qb = this.clienteRepo
                .createQueryBuilder('cliente')
                .where('cliente.deletedAt IS NULL');

            // Aplicar filtros dinámicamente
            if (filter?.nombre)
                qb.andWhere('cliente.nombre ILIKE :nombre', {
                    nombre: `%${filter.nombre}%`,
                });
            if (filter?.apellido)
                qb.andWhere('cliente.apellido ILIKE :apellido', {
                    apellido: `%${filter.apellido}%`,
                });
            if (filter?.tipo_documento)
                qb.andWhere('cliente.tipo_documento = :tipo_documento', {
                    tipo_documento: filter.tipo_documento,
                });
            if (filter?.num_documento)
                qb.andWhere('cliente.num_documento = :num_documento', {
                    num_documento: filter.num_documento,
                });
            if (filter?.telefono)
                qb.andWhere('cliente.telefono ILIKE :telefono', {
                    telefono: `%${filter.telefono}%`,
                });

            qb.orderBy('cliente.id', 'ASC');

            const clientes = await qb.getMany();
            return clientes;
        } catch (error) {
            throw new HttpException('Error al obtener los clientes', 500);
        }
    }

    async findOne(id: number): Promise<Cliente> {
        try {
            const cliente = await this.clienteRepo
                .createQueryBuilder('cliente')
                .where('cliente.id = :id', { id })
                .andWhere('cliente.deletedAt IS NULL')
                .getOne();

            if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
            return cliente;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new HttpException('Error al obtener el cliente', 500);
        }
    }

    async update(id: number, data: any): Promise<Cliente> {
        try {
            const cliente = await this.findOne(id);
            Object.assign(cliente, data);
            return await this.clienteRepo.save(cliente);
        } catch (error) {
            throw new HttpException('Error al actualizar el cliente', 500);
        }
    }

    async softDelete(id: number): Promise<void> {
        try {
            const result = await this.clienteRepo
                .createQueryBuilder()
                .update(Cliente)
                .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
                .where('id = :id', { id })
                .execute();

            if (result.affected === 0)
                throw new NotFoundException(`Cliente con id ${id} no encontrado`);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new HttpException('Error al eliminar el cliente', 500);
        }
    }


}
