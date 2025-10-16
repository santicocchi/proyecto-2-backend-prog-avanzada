import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { IProveedorRepository } from './interface/IProveedorRepository';
import { ProveedorMapper } from './interface/proveedor.mapper';

@Injectable()
export class ProveedorService {
  constructor(
    @Inject('IProveedorRepository')
    private readonly proveedorRepository: IProveedorRepository
  ) {}

  async create(createProveedorDto: CreateProveedorDto) {
    const proveedor = await this.proveedorRepository.create(createProveedorDto);
    return ProveedorMapper.toCreateResponse(proveedor);
  }

  async findAll() {
    const proveedores = await this.proveedorRepository.findAll();
    return ProveedorMapper.toListResponse(proveedores);
  }

  async findOne(id: number) {
    const proveedor = await this.proveedorRepository.findById(id);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return ProveedorMapper.toResponse(proveedor);
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    const proveedor = await this.proveedorRepository.update(id, updateProveedorDto);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return ProveedorMapper.toResponse(proveedor);
  }

  async remove(id: number) {
    const proveedor = await this.proveedorRepository.findById(id);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    await this.proveedorRepository.softDelete(id);
    return ProveedorMapper.toDeleteResponse(proveedor);
  }
}
