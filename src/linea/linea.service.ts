import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    const linea = await this.lineaRepository.create(createLineaDto);
    return LineaMapper.toCreateResponse(linea);
  }

  async findAll() {
    const lineas = await this.lineaRepository.findAll();
    return LineaMapper.toListResponse(lineas);
  }

  async findOne(id: number) {
    const linea = await this.lineaRepository.findById(id);
    if (!linea) throw new NotFoundException('Linea no encontrada');
    return LineaMapper.toResponse(linea);
  }

  async update(id: number, updateLineaDto: UpdateLineaDto) {
    const linea = await this.lineaRepository.update(id, updateLineaDto);
    if (!linea) throw new NotFoundException('Linea no encontrada');
    return LineaMapper.toUpdateResponse(linea);
  }

  async remove(id: number) {
    const linea = await this.lineaRepository.findById(id);
    if (!linea) throw new NotFoundException('Linea no encontrada');
    await this.lineaRepository.softDelete(id);
    return LineaMapper.toDeleteResponse(linea);
  }
}
