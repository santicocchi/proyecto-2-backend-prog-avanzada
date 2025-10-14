import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { FormaPago } from './entities/forma_pago.entity';
import { IFormaPagoRepository } from './interface/IFormaPagoRepository';
import { CreateFormaPagoDto } from './dto/create-forma_pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma_pago.dto';

@Injectable()
export class FormaPagoRepository implements IFormaPagoRepository {
    constructor(
        @InjectRepository(FormaPago)
        private readonly formaPagoRepo: Repository<FormaPago>,
    ) { }

    async create(data: CreateFormaPagoDto): Promise<FormaPago> {
        try {
            const formaPago = this.formaPagoRepo.create(data);
            return await this.formaPagoRepo.save(formaPago);
        } catch (error) {
            throw new HttpException('Error al crear la forma de pago', 500);
        }
    }

    async findAll(): Promise<FormaPago[]> {
        try {
            const formasPago = await this.formaPagoRepo
                .createQueryBuilder('formaPago')
                .where('formaPago.deletedAt IS NULL')
                .orderBy('formaPago.id', 'ASC')
                .getMany();

            return formasPago;
        } catch (error) {
            throw new HttpException('Error al obtener las formas de pago', 500);
        }
    }

    async findOne(id: number): Promise<FormaPago> {
        try {
            const formaPago = await this.formaPagoRepo
                .createQueryBuilder('formaPago')
                .where('formaPago.id = :id', { id })
                .andWhere('formaPago.deletedAt IS NULL')
                .getOne();

            if (!formaPago) throw new NotFoundException(`Forma de pago con id ${id} no encontrada`);
            return formaPago;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new HttpException('Error al obtener la forma de pago', 500);
        }
    }

    async update(id: number, data: UpdateFormaPagoDto): Promise<FormaPago> {
        try {
            const formaPago = await this.findOne(id);
            if (!formaPago) throw new NotFoundException(`Forma de pago con id ${id} no encontrada`);
            this.formaPagoRepo.merge(formaPago, data);
            return await this.formaPagoRepo.save(formaPago);
        } catch (error) {
            throw new HttpException('Error al actualizar la forma de pago', 500);
        }
    }

    async softDelete(id: number): Promise<FormaPago> {
        try {
            const formaPago = await this.findOne(id);

            await this.formaPagoRepo
                .createQueryBuilder()
                .update(FormaPago)
                .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
                .where('id = :id', { id })
                .execute();

            return formaPago;
        } catch (error) {
            throw new HttpException('Error al eliminar la forma de pago', 500);
        }
    }
}
