import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IProductoRepository } from './interface/IProductoRepository';
import { ProductoMapper } from './helpers/producto.mapper';
import { IMarcaRepository } from 'src/marca/interface/IMarcaRepository';
import { ILineaRepository } from 'src/linea/interface/ILineaRepository';

@Injectable()
export class ProductoService {
  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
    @Inject('IMarcaRepository')
    private readonly marcaRepo: IMarcaRepository,
    @Inject('ILineaRepository')
    private readonly lineaRepo: ILineaRepository,
  ) { }


  async create(dto: CreateProductoDto) {
    //  Buscar la marca con sus líneas
    const marca = await this.marcaRepo.findById(dto.marcaId.id);
    if (!marca) throw new NotFoundException('Marca no encontrada');

    //  Buscar la línea
    const linea = await this.lineaRepo.findById(dto.lineaId.id);
    if (!linea) throw new NotFoundException('Línea no encontrada');

    //  Validar que la línea pertenezca a la marca
    const lineaPertenece = marca.lineas.some((l) => l.id === linea.id);
    if (!lineaPertenece) {
      throw new BadRequestException(
        `La línea con ID ${dto.lineaId} no pertenece a la marca ${marca.nombre}`,
      );
    }
    const producto = await this.productoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      stock: dto.stock,
      marca,
      linea,
    });
    // Mapear la respuesta
    return ProductoMapper.toCreateResponse(producto);
  }

  async findAll(options?: any) {
    const productos = await this.productoRepository.findAll(options);
    return ProductoMapper.toListResponse(productos);
  }

  async advancedList(filters: any) {
    const productos = await this.productoRepository.advancedList(filters);
    return ProductoMapper.toListResponse(productos);
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findById(id);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return ProductoMapper.toResponse(producto);
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepository.update(id, updateProductoDto);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return ProductoMapper.toResponse(producto);
  }

  async decreaseStock(id: number, cantidad: number) {
    const producto = await this.productoRepository.decreaseStock(id, cantidad);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return ProductoMapper.toResponse(producto);
  }

  async remove(id: number) {
    const producto = await this.productoRepository.findById(id);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    await this.productoRepository.softDelete(id);
    return ProductoMapper.toDeleteResponse(producto);
  }
}
