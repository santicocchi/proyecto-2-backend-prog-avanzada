import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { IMarcaRepository } from './interface/IMarcaRepository';
import { MarcaMapper } from './interface/marca.mapper';

@Injectable()
export class MarcaService {
  constructor(
    @Inject('IMarcaRepository')
    private readonly marcaRepository: IMarcaRepository
  ) {}
  
  async create(createMarcaDto: CreateMarcaDto) {
    const marca = await this.marcaRepository.create(createMarcaDto);
    return MarcaMapper.toCreateResponse(marca);
  }
  
  async findAll() {
    const marcas = await this.marcaRepository.findAll();
    return MarcaMapper.toListResponse(marcas);
  }

  async findOne(id: number) {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return MarcaMapper.toResponse(marca);
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    const marca = await this.marcaRepository.update(id, updateMarcaDto);
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return MarcaMapper.toResponse(marca);
  }

  async remove(id: number) {
    // Para el mensaje, primero obtenemos la marca antes de eliminar
    const marca = await this.marcaRepository.findById(id);
    if (!marca) throw new NotFoundException('Marca no encontrada');
    await this.marcaRepository.softDelete(id);
    return MarcaMapper.toDeleteResponse(marca);
  }
  async assignLinea(marcaId: number, lineaId: number) {
    const result = await this.marcaRepository.assignLinea(marcaId, lineaId);
    if (!result.success) {
      return { message: result.message };
    }
    return { message: result.message };
  }
  
  async removeLinea(marcaId: number, lineaId: number) {
    const result = await this.marcaRepository.removeLinea(marcaId, lineaId);
    if (!result.success) {
      return { message: result.message };
    }
    return { message: result.message };
  }
  
}
