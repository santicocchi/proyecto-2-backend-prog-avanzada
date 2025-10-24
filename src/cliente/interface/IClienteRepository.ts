import { CreateClienteDto } from "../dto/create-cliente.dto";
import { UpdateClienteDto } from "../dto/update-cliente.dto";
import { Cliente } from "../entities/cliente.entity";

export interface IClienteRepository {
  create(data: CreateClienteDto): Promise<Cliente>;
  findAll(filter: any): Promise<{data:Cliente[], total: number}>;
  findOne(id: number): Promise<Cliente>;
  update(id: number, data: UpdateClienteDto): Promise<Cliente>;
  softDelete(id: number): Promise<void>;
}
