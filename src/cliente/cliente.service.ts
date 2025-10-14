import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteRepository } from './cliente.repository';
import { ClienteMapper } from './helpers/cliente.mapper';

@Injectable()
export class ClienteService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.clienteRepository.create(createClienteDto);
    return ClienteMapper.toResponse(cliente);
  }

  async findAll(filter: any = {}) {
    const clientes = await this.clienteRepository.findAll(filter);
    return ClienteMapper.toResponseList(clientes);
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne(id);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return ClienteMapper.toResponse(cliente);
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.update(id, updateClienteDto);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return ClienteMapper.toResponse(cliente);
  }

  async remove(id: number) {
    const cliente = await this.clienteRepository.findOne(id);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    await this.clienteRepository.softDelete(id);
    return { message: 'Cliente eliminado correctamente' };
  }
}
