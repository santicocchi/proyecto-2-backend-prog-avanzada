import { DetalleVenta } from '../entities/detalle_venta.entity';

export class DetalleVentaMapper {
  static toResponse(detalle: DetalleVenta) {
    return {
      producto: detalle.producto,
      cantidad: detalle.cantidad,
      subtotal: detalle.subtotal,
    };
  }

  static toDeleteResponse(id: number) {
    return {
      message: `Detalle de venta con id ${id} fue eliminado exitosamente`,
    };
  }
}
