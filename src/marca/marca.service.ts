import { Inject, Injectable, NotFoundException, HttpException } from '@nestjs/common';
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
    try {
    const marca = await this.marcaRepository.create(createMarcaDto);
    return MarcaMapper.toCreateResponse(marca);
    } catch (error) {
      throw new HttpException('Error al crear la marca', 500);
    }
  }
  
  async findAll() {
    try {
    const marcas = await this.marcaRepository.findAll();
    return MarcaMapper.toListResponse(marcas);
    } catch (error) {
      throw new HttpException('Error al obtener las marcas', 500);
    }
  }

  async findOne(id: number) {
    try {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return MarcaMapper.toResponse(marca);
    } catch (error) {
      throw new HttpException('Error al obtener la marca', 500);
    }
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    try {
    const marca = await this.marcaRepository.update(id, updateMarcaDto);
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return MarcaMapper.toResponse(marca);
    } catch (error) {
      throw new HttpException('Error al actualizar la marca', 500);
    }
  }

  async remove(id: number) {
    // Para el mensaje, primero obtenemos la marca antes de eliminar
    try {
    const marca = await this.marcaRepository.findById(id);
    if (!marca) throw new NotFoundException('Marca no encontrada');
    await this.marcaRepository.softDelete(id);
    return MarcaMapper.toDeleteResponse(marca);
    } catch (error) {
      throw new HttpException('Error al eliminar la marca', 500);
    }
  }


  async assignLinea(marcaId: number, lineaId: number) {
    try {
    const marca = await this.marcaRepository.getMarcaWithLineas(marcaId);
    if (!marca) throw new NotFoundException('Marca no encontrada');

    const linea = await this.marcaRepository.getLineaById(lineaId);
    if (!linea) throw new NotFoundException('Linea no encontrada');

    if (marca.lineas && marca.lineas.some(l => l.id === linea.id)) {
      return { message: `La linea ${linea.nombre} ya está asignada a la marca ${marca.nombre}` };
    }

    marca.lineas = [...(marca.lineas || []), linea];
    await this.marcaRepository.saveMarca(marca);
    return { message: `La linea ${linea.nombre} fue asignada a la marca ${marca.nombre} con exito` };
    } catch (error) {
      throw new HttpException('Error al asignar la linea a la marca', 500);
    }
  }

  async removeLinea(marcaId: number, lineaId: number) {
    try {
    const marca = await this.marcaRepository.getMarcaWithLineas(marcaId);
    if (!marca) throw new NotFoundException('Marca no encontrada');

    const linea = await this.marcaRepository.getLineaById(lineaId);
    if (!linea) throw new NotFoundException('Linea no encontrada');

    if (!marca.lineas || !marca.lineas.some(l => l.id === linea.id)) {
      return { message: `La linea ${linea.nombre} no está asignada a la marca ${marca.nombre}` };
    }

    marca.lineas = marca.lineas.filter(l => l.id !== linea.id);
    await this.marcaRepository.saveMarca(marca);
    return { message: `La linea ${linea.nombre} fue eliminada de la marca ${marca.nombre} con exito` };
    } catch (error) {
      throw new HttpException('Error al eliminar la linea de la marca', 500);
    }
  }
  
}
