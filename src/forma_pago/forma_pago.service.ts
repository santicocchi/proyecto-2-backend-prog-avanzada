import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormaPagoDto } from './dto/create-forma_pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma_pago.dto';
import { FormaPagoRepository } from './forma_pago.repository';
import { FormaPagoMapper } from './helpers/forma_pago.mapper';

@Injectable()
export class FormaPagoService {
  constructor(private readonly formaPagoRepository: FormaPagoRepository) {}

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
