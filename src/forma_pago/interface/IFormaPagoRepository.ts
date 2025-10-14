import { CreateFormaPagoDto } from "../dto/create-forma_pago.dto";
import { UpdateFormaPagoDto } from "../dto/update-forma_pago.dto";
import { FormaPago } from "../entities/forma_pago.entity";

export interface IFormaPagoRepository {
  create(data: CreateFormaPagoDto): Promise<FormaPago>;
  findAll(): Promise<FormaPago[]>;
  findOne(id: number): Promise<FormaPago | null>;
  update(id: number, data: UpdateFormaPagoDto): Promise<FormaPago | null>;
  softDelete(id: number): Promise<any>;
}