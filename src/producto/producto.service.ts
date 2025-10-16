// src/producto/producto.service.ts
import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IProductoRepository } from './interface/IProductoRepository';
import { ProductoMapper } from './interface/producto.mapper';
import { IMarcaRepository } from 'src/marca/interface/IMarcaRepository';
import { ILineaRepository } from 'src/linea/interface/ILineaRepository';
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { FindAdvancedProductoDto } from './dto/find-advanced-producto.dto';

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
    try {
      //  Buscar la marca con sus líneas
      const marca = await EntityExistsValidator.validate(
        this.marcaRepo.findById(dto.marcaId.id),
        'Marca',
      );

      //  Buscar la línea
      const linea = await EntityExistsValidator.validate(
        this.lineaRepo.findById(dto.lineaId.id),
        'Línea',
      );
      //  Validar que la línea pertenezca a la marca
      const lineaPertenece = marca.lineas.some((l) => l.id === linea.id);
      if (!lineaPertenece) {
        throw new BadRequestException(
          `La línea ${linea.nombre} no pertenece a la marca ${marca.nombre}`,
        );
      }

      const producto = await this.productoRepository.create({
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        precio_sin_impuesto: dto.precio,
        stock: dto.stock,
        impuesto: 21,
        precio_con_impuesto: dto.precio * (1 + 21 / 100),
        marca,
        linea,
      });
      // Mapear la respuesta
      return ProductoMapper.toCreateResponse(producto);
    } catch (error) {
      throw new HttpException('Error al crear el producto', 500);
    }
  }

  async findAll(options?: any) {
    try {
      const productos = await this.productoRepository.findAll(options);
      return ProductoMapper.toListResponse(productos);
    } catch (error) {
      throw new HttpException('Error al obtener los productos', 500);
    }
  }

  async advancedList(filters: FindAdvancedProductoDto) {
    try {
      const [productos, total] = await this.productoRepository.advancedList(filters);
      return {
        total,
        data: ProductoMapper.toListResponse(productos),
      };
    } catch (error) {
      throw new HttpException('Error en la búsqueda avanzada de productos', 500);
    }
  }

  async findOne(id: number) {
    try {
      const producto = await this.productoRepository.findById(id);
      if (!producto) throw new NotFoundException('Producto no encontrado');
      return ProductoMapper.toResponse(producto);
    } catch (error) {
      throw new HttpException('Error al obtener el producto', 500);
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const producto = await this.productoRepository.update(id, updateProductoDto);
      if (!producto) throw new NotFoundException('Producto no encontrado');
      return ProductoMapper.toResponse(producto);
    } catch (error) {
      throw new HttpException('Error al actualizar el producto', 500);
    }
  }

  async decreaseStock(id: number, cantidad: number) {
    try {
      const producto = await this.productoRepository.decreaseStock(id, cantidad);
      if (!producto) throw new NotFoundException('Producto no encontrado');
      return ProductoMapper.toResponse(producto);
    } catch (error) {
      throw new HttpException('Error al disminuir el stock del producto', 500);
    }
  }

  async remove(id: number) {
    try {
      const producto = await this.productoRepository.findById(id);
      if (!producto) throw new NotFoundException('Producto no encontrado');
      await this.productoRepository.softDelete(id);
      return ProductoMapper.toDeleteResponse(producto);
    } catch (error) {
      throw new HttpException('Error al eliminar el producto', 500);
    }
  }
}
