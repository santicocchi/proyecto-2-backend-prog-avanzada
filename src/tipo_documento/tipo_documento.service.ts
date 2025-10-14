import { Inject, Injectable } from '@nestjs/common';
import { CreateTipoDocumentoDto } from './dto/create-tipo_documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo_documento.dto';
import { ITipoDocumentoRepository } from './interface/ITipo_documentoRepository';

@Injectable()
export class TipoDocumentoService {
  constructor(
    @Inject('ITipoDocumentoRepository')
    private readonly tipoDocumentoRepository: ITipoDocumentoRepository 
  ) {}
  async create(data: CreateTipoDocumentoDto) {
    return this.tipoDocumentoRepository.create(data);
  }

  async findAll(){
    return this.tipoDocumentoRepository.findAll();
  }

  async findOne(id: number) {
    return this.tipoDocumentoRepository.findById(id);
  }

  async update(id: number, updateTipoDocumentoDto: UpdateTipoDocumentoDto) {
    return this.tipoDocumentoRepository.update(id, updateTipoDocumentoDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} tipoDocumento`;
  // }
}
