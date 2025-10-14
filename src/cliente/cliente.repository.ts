import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { IClienteRepository } from './interface/IClienteRepository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { TipoDocumento } from '../tipo_documento/entities/tipo_documento.entity';

@Injectable()
export class ClienteRepository implements IClienteRepository {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepo: Repository<Cliente>,
        @InjectRepository(TipoDocumento)
        private readonly tipoDocumentoRepo: Repository<TipoDocumento>,
    ) { }

    async create(dto: CreateClienteDto): Promise<Cliente> {
        try {
            const tipoDocumento = await this.tipoDocumentoRepo.findOne({
                where: { id: dto.tipo_documento, deletedAt: IsNull() },
            });
            if (!tipoDocumento) {
                throw new NotFoundException(`Tipo de documento ${dto.tipo_documento} no encontrado`);
            }

            const existe = await this.clienteRepo.findOne({
                where: {
                    num_documento: dto.num_documento,
                    tipo_documento: { id: tipoDocumento.id },
                    deletedAt: IsNull(),
                },
                relations: ['tipo_documento'],
            });
            if (existe) {
                throw new HttpException(
                    'Ya existe un cliente con ese tipo y numero de documento',
                    400,
                );
            }

            const cliente = this.clienteRepo.create({
                nombre: dto.nombre,
                apellido: dto.apellido,
                num_documento: dto.num_documento,
                telefono: dto.telefono,
                tipo_documento: tipoDocumento,
            });

            await this.clienteRepo.save(cliente);
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
                .leftJoinAndSelect('cliente.tipo_documento', 'tipo_documento')
                .where('cliente.deletedAt IS NULL');

            // Aplicar filtros dinamicamente
            if (filter?.nombre) {
                qb.andWhere('cliente.nombre ILIKE :nombre', {
                    nombre: `%${filter.nombre}%`,
                });
            }
            if (filter?.apellido) {
                qb.andWhere('cliente.apellido ILIKE :apellido', {
                    apellido: `%${filter.apellido}%`,
                });
            }
            if (filter?.tipo_documento) {
                qb.andWhere('tipo_documento.id = :tipoDocumentoId', {
                    tipoDocumentoId: filter.tipo_documento,
                });
            }
            if (filter?.num_documento) {
                qb.andWhere('cliente.num_documento = :num_documento', {
                    num_documento: filter.num_documento,
                });
            }
            if (filter?.telefono) {
                qb.andWhere('cliente.telefono ILIKE :telefono', {
                    telefono: `%${filter.telefono}%`,
                });
            }

            qb.orderBy('cliente.id', 'ASC');

            return await qb.getMany();
        } catch (error) {
            throw new HttpException('Error al obtener los clientes', 500);
        }
    }

    async findOne(id: number): Promise<Cliente> {
        try {
            const cliente = await this.clienteRepo
                .createQueryBuilder('cliente')
                .leftJoinAndSelect('cliente.tipo_documento', 'tipo_documento')
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

    async update(id: number, data: UpdateClienteDto): Promise<Cliente> {
        try {
            const cliente = await this.clienteRepo.findOne({
                where: { id, deletedAt: IsNull() },
                relations: ['tipo_documento'],
            });
            if (!cliente) throw new NotFoundException(`Cliente con id ${id} no encontrado`);

            const { tipo_documento: tipoDocumentoId, ...restoDatos } = data;

            if (tipoDocumentoId !== undefined) {
                const tipoDocumento = await this.tipoDocumentoRepo.findOne({
                    where: { id: tipoDocumentoId, deletedAt: IsNull() },
                });
                if (!tipoDocumento) {
                    throw new NotFoundException(`Tipo de documento ${tipoDocumentoId} no encontrado`);
                }
                cliente.tipo_documento = tipoDocumento;
            }

            Object.assign(cliente, restoDatos);
            await this.clienteRepo.save(cliente);
            return await this.findOne(cliente.id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException('Error al actualizar el cliente', 500);
        }
    }

    async softDelete(id: number): Promise<void> {
        try {
            const result = await this.clienteRepo
                .createQueryBuilder()
                .update(Cliente)
                .set({ deletedAt: new Date() })
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
