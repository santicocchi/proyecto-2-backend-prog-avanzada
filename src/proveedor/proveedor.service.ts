import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    try {
    const proveedor = await this.proveedorRepository.create(createProveedorDto);
    return ProveedorMapper.toCreateResponse(proveedor);
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new HttpException('Error al crear el proveedor', 500);
    }
  }

  async findAll() {
    try {
    const proveedores = await this.proveedorRepository.findAll();
    return ProveedorMapper.toListResponse(proveedores);
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener los proveedores', 500);
    }
  }

  async findOne(id: number) {
    try {
    const proveedor = await this.proveedorRepository.findById(id);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return ProveedorMapper.toResponse(proveedor);
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener el proveedor', 500);
    }
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    try {
    const proveedor = await this.proveedorRepository.update(id, updateProveedorDto);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    return ProveedorMapper.toResponse(proveedor);
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar el proveedor', 500);
    }
  }

  async remove(id: number) {
    try {
    const proveedor = await this.proveedorRepository.findById(id);
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');
    await this.proveedorRepository.softDelete(id);
    return ProveedorMapper.toDeleteResponse(proveedor);
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new HttpException('Error al eliminar el proveedor', 500);
    }
  }
}
