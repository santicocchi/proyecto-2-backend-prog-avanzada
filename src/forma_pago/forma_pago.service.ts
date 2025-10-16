import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormaPagoDto } from './dto/create-forma_pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma_pago.dto';
import { FormaPagoMapper } from './interface/forma_pago.mapper';
import { IFormaPagoRepository } from './interface/IFormaPagoRepository';

@Injectable()
export class FormaPagoService {
  constructor(
    @Inject('IFormaPagoRepository')
    private readonly formaPagoRepository: IFormaPagoRepository) {}

  async create(createFormaPagoDto: CreateFormaPagoDto) {
    const formaPago = await this.formaPagoRepository.create(createFormaPagoDto);
    return FormaPagoMapper.toCreateResponse(formaPago);
  }

  async findAll() {
    const formasPago = await this.formaPagoRepository.findAll();
    return FormaPagoMapper.toListResponse(formasPago);
  }

  async findOne(id: number) {
    const formaPago = await this.formaPagoRepository.findOne(id);
    if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
    return FormaPagoMapper.toGetResponse(formaPago);
  }

  async update(id: number, updateFormaPagoDto: UpdateFormaPagoDto) {
    const formaPago = await this.formaPagoRepository.update(id, updateFormaPagoDto);
    if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
    return FormaPagoMapper.toUpdateResponse(formaPago);
  }

  async remove(id: number) {
    const formaPago = await this.formaPagoRepository.softDelete(id);
    if (!formaPago) throw new NotFoundException('Forma de pago no encontrada');
    return FormaPagoMapper.toDeleteResponse(formaPago);
  }
}
