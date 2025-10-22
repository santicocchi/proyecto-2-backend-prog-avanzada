import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormaPagoDto } from './dto/create-forma_pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma_pago.dto';
import { FormaPagoMapper } from './interface/forma_pago.mapper';
import { IFormaPagoRepository } from './interface/IFormaPagoRepository';
import { HttpException } from '@nestjs/common';

@Injectable()
export class FormaPagoService {
  constructor(
    @Inject('IFormaPagoRepository')
    private readonly formaPagoRepository: IFormaPagoRepository) { }

  async create(createFormaPagoDto: CreateFormaPagoDto) {
    try {
      const formaPago = await this.formaPagoRepository.create(createFormaPagoDto);
      return FormaPagoMapper.toCreateResponse(formaPago);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear la forma de pago', 500);
    }
  }

  async findAll() {
    try {
      const formasPago = await this.formaPagoRepository.findAll();
      return FormaPagoMapper.toListResponse(formasPago);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener las formas de pago', 500);
    }
  }

  async findOne(id: number) {
    try {
      const formaPago = await this.formaPagoRepository.findOne(id);
      if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
      return FormaPagoMapper.toGetResponse(formaPago);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new NotFoundException('Forma de pago no encontrada');
    }
  }

  async update(id: number, updateFormaPagoDto: UpdateFormaPagoDto) {
    try {
      const formaPago = await this.formaPagoRepository.update(id, updateFormaPagoDto);
      if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
      return FormaPagoMapper.toUpdateResponse(formaPago);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error interno del servidor', 500);
    }
  }
  async remove(id: number) {
    try {
    const formaPago = await this.formaPagoRepository.softDelete(id);
    if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
    return FormaPagoMapper.toDeleteResponse(formaPago);
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw new HttpException('Error interno del servidor', 500);
  }
  }
}
