import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { ILineaRepository } from './interface/ILineaRepository';
import { LineaMapper } from './interface/linea.mapper';

@Injectable()
export class LineaService {
  constructor(
    @Inject('ILineaRepository')
    private readonly lineaRepository: ILineaRepository
  ) {}

  async create(createLineaDto: CreateLineaDto) {
    try {
    const linea = await this.lineaRepository.create(createLineaDto);
    return LineaMapper.toCreateResponse(linea);
    } catch (error) {
      throw new HttpException('Error al crear la linea', 500);
    }
  }

  async findAll() {
    try {
    const lineas = await this.lineaRepository.findAll();
    return LineaMapper.toListResponse(lineas);
    } catch (error) {
      throw new HttpException('Error al obtener las lineas', 500);
    }
  }

  async findOne(id: number) {
    try {
      const linea = await this.lineaRepository.findById(id);
      if (!linea) throw new NotFoundException('Linea no encontrada');
      return LineaMapper.toResponse(linea);  
    } catch (error) {
      throw new HttpException('Error al obtener la linea', 500);
    }
  }

  async update(id: number, updateLineaDto: UpdateLineaDto) {
    try {
      const linea = await this.lineaRepository.update(id, updateLineaDto);
      if (!linea) throw new NotFoundException('Linea no encontrada');
      return LineaMapper.toUpdateResponse(linea);
    } catch (error) {
      throw new HttpException('Error al actualizar la linea', 500);
    }
  }

  async remove(id: number) {
    try {
      const linea = await this.lineaRepository.findById(id);
      if (!linea) throw new NotFoundException('Linea no encontrada');
      await this.lineaRepository.softDelete(id);
      return LineaMapper.toDeleteResponse(linea);
    } catch (error) {
      throw new HttpException('Error al eliminar la linea', 500);
    }
  }
}
