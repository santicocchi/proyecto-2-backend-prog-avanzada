import { Inject, Injectable, NotFoundException, HttpException, BadRequestException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { IMarcaRepository } from './interface/IMarcaRepository';
import { MarcaMapper } from './interface/marca.mapper';
import { ProductoService } from 'src/producto/producto.service';

@Injectable()
export class MarcaService {
  constructor(
    @Inject('IMarcaRepository')
    private readonly marcaRepository: IMarcaRepository,
    private readonly productoService: ProductoService,
  ) { }

  async create(createMarcaDto: CreateMarcaDto) {
    try {
      const marca = await this.marcaRepository.create(createMarcaDto);
      return MarcaMapper.toCreateResponse(marca);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear la marca', 500);
    }
  }

  async findAll() {
    try {
      const marcas = await this.marcaRepository.findAll();
      return MarcaMapper.toListResponse(marcas);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener las marcas', 500);
    }
  }

  async findOne(id: number) {
    try {
      const marca = await this.marcaRepository.findById(id);
      if (!marca) throw new NotFoundException('Marca no encontrada');
      return MarcaMapper.toResponse(marca);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener la marca', 500);
    }
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    try {
      const marca = await this.marcaRepository.update(id, updateMarcaDto);
      if (!marca) throw new NotFoundException('Marca no encontrada');
      return MarcaMapper.toResponse(marca);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al actualizar la marca', 500);
    }
  }

  async remove(id: number) {
    try {
      // Buscar la marca con sus productos
      const marca = await this.marcaRepository.findById(id);
      if (!marca) throw new NotFoundException('Marca no encontrada');

      // Verificar si tiene productos asociados
      if (marca.productos && marca.productos.length > 0) {
        const productosConStock = marca.productos.filter(
          (p) => p.deletedAt === null && p.stock > 0,
        );

        if (productosConStock.length > 0) {
          const nombres = productosConStock.map((p) => `${p.nombre}`).join(', ');
          throw new BadRequestException(
            `No se puede eliminar la marca ${marca.nombre} porque los siguientes productos aún tienen stock: ${nombres}.`,
          );
        }

        // Soft delete de los productos sin stock
        for (const producto of marca.productos) {
          if (producto.deletedAt === null && producto.stock === 0) {
            await this.productoService.remove(producto.id);
          }
        }
      }

      // 4️⃣ Soft delete de la marca
      await this.marcaRepository.softDelete(id);

      // 5️⃣ Respuesta final
      return MarcaMapper.toDeleteResponse(marca);

    } catch (error) {
      if (error instanceof HttpException) throw error;
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
      if (error instanceof HttpException) throw error;
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
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al eliminar la linea de la marca', 500);
    }
  }

}
