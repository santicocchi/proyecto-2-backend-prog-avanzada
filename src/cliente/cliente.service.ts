import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteMapper } from './interface/cliente.mapper';
import { IClienteRepository } from './interface/IClienteRepository';

@Injectable()
export class ClienteService {
  constructor(
    @Inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.clienteRepository.create(createClienteDto);
    return ClienteMapper.toResponse(cliente);
  }

  async findAll(filter: any = {}): Promise<{data: any[], total: number}> {
    const {data, total} = await this.clienteRepository.findAll(filter);
    const response = ClienteMapper.toResponseList(data);

    return { data: response, total : total };
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
