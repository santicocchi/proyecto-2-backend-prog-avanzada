import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IProductoRepository } from './interface/IProductoRepository';
import { ProductoMapper } from './helpers/producto.mapper';

@Injectable()
export class ProductoService {
  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const producto = await this.productoRepository.create(createProductoDto);
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
