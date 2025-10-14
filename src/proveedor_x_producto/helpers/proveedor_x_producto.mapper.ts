import { ProveedorXProducto } from '../entities/proveedor_x_producto.entity';

export class ProveedorXProductoMapper {
  static toResponse(pxp: ProveedorXProducto) {
    if (!pxp) return null;
    return {
      id: pxp.id,
      producto: pxp.producto,
      proveedor: pxp.proveedor,
      precio_proveedor: pxp.precio_proveedor,
      codigo_proveedor: pxp.codigo_proveedor,
      createdAt: pxp.createdAt,
      updatedAt: pxp.updatedAt,
    };
  }

  static toListResponse(pxpList: ProveedorXProducto[]) {
    return pxpList.map(pxp => ({
      id: pxp.id,
      producto: pxp.producto,
      proveedor: pxp.proveedor,
      precio_proveedor: pxp.precio_proveedor,
      codigo_proveedor: pxp.codigo_proveedor,
    }));
  }

  static toCreateResponse(pxp: ProveedorXProducto) {
    return {
      id: pxp.id,
      producto: pxp.producto,
      proveedor: pxp.proveedor,
      precio_proveedor: pxp.precio_proveedor,
      codigo_proveedor: pxp.codigo_proveedor,
      createdAt: pxp.createdAt,
    };
  }

  static toDeleteResponse(pxp: ProveedorXProducto) {
    return {
      message: `La relación proveedor-producto con id ${pxp.id} fue eliminada exitosamente.`
    };
  }
}
