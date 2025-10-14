import { Producto } from '../entities/producto.entity';

export class ProductoMapper {
  static toResponse(producto: Producto) {
    if (!producto) return null;
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      marca: producto.marca ? { id: producto.marca.id, nombre: producto.marca.nombre } : null,
      linea: producto.marca && producto.marca.lineas && producto.marca.lineas.length > 0 ? producto.marca.lineas.map(l => ({ id: l.id, nombre: l.nombre })) : [],
      proveedores: producto.proveedor_x_producto?.map(pxp => ({
        id: pxp.proveedor?.id,
        nombre: pxp.proveedor?.nombre,
        direccion: pxp.proveedor?.direccion,
        cuit: pxp.proveedor?.cuit,
        ...pxp // puedes agregar más campos si es necesario
      })) || [],
      createdAt: producto.createdAt,
      updatedAt: producto.updatedAt,
    };
  }

  static toListResponse(productos: Producto[]) {
    return productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      marca: p.marca ? { id: p.marca.id, nombre: p.marca.nombre } : null,
      linea: p.marca && p.marca.lineas && p.marca.lineas.length > 0 ? p.marca.lineas.map(l => ({ id: l.id, nombre: l.nombre })) : [],
    }));
  }

  static toCreateResponse(producto: Producto) {
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      marca: producto.marca ? { id: producto.marca.id, nombre: producto.marca.nombre } : null,
      linea: producto.marca && producto.marca.lineas && producto.marca.lineas.length > 0 ? producto.marca.lineas.map(l => ({ id: l.id, nombre: l.nombre })) : [],
      proveedores: producto.proveedor_x_producto?.map(pxp => ({
        id: pxp.proveedor?.id,
        nombre: pxp.proveedor?.nombre,
        direccion: pxp.proveedor?.direccion,
        cuit: pxp.proveedor?.cuit,
      })) || [],
      createdAt: producto.createdAt,
    };
  }

  static toDeleteResponse(producto: Producto) {
    return {
      message: `El producto ${producto.nombre} con id ${producto.id} fue eliminado exitosamente.`
    };
  }
}
