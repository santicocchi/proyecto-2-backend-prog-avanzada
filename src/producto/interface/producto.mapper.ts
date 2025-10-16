// src/producto/helpers/producto.mapper.ts
import { Producto } from '../entities/producto.entity';

export class ProductoMapper {
  static toResponse(producto: Producto) {
    if (!producto) return null;
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_sin_impuesto: producto.precio_sin_impuesto,
      impuesto: producto.impuesto,
      precio_con_impuesto: producto.precio_con_impuesto,
      stock: producto.stock,
      marca: producto.marca.nombre,
      linea: producto.linea.nombre,
      proveedores: producto.proveedor_x_producto?.map(pxp => ({
        nombre: pxp.proveedor?.nombre,
        precio_proveedor: pxp.precio_proveedor,
        codigo_proveedor: pxp.codigo_proveedor 
      })) || [],
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt,
    };
  }

  static toListResponse(productos: Producto[]) {
    return productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      // descripcion: p.descripcion,
      precio_con_impuesto: p.precio_con_impuesto,
      stock: p.stock,
      marca: p.marca.nombre ,
      linea: p.linea.nombre,
    }));
  }

  static toCreateResponse(producto: Producto) { //cuando se crea un producto
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio_sin_impuesto: producto.precio_sin_impuesto,
      impuesto: producto.impuesto,
      precio_con_impuesto: producto.precio_con_impuesto,
      stock: producto.stock,
      marca: producto.marca.nombre,
      linea: producto.linea.nombre,
      // proveedores: producto.proveedor_x_producto?.map(pxp => ({
      //   nombre: pxp.proveedor?.nombre,
      // })) || [],
      createdAt: producto.createdAt,
    };
  }

  static toDeleteResponse(producto: Producto) {
    return {
      message: `El producto ${producto.nombre} con id ${producto.id} fue eliminado exitosamente.`
    };
  }
}
