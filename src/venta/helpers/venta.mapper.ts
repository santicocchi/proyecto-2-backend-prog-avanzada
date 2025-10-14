export class VentaMapper {
  static toResponse(venta: any) {
    return {
      id: venta.id,
      fecha: venta.fecha_venta,
      cliente: venta.cliente,
      responsable: venta.responsable,
      formaPago: venta.formaPago,
      detallesVenta: venta.detallesVenta,
      total: venta.total,
      createdAt: venta.createdAt,
      updatedAt: venta.updatedAt,
    };
  }

  static toListResponse(ventas: any[]) {
    return ventas.map(v => ({
      id: v.id,
      fecha: v.fecha_venta,
      cliente: v.cliente,
      responsable: v.responsable,
      formaPago: v.formaPago,
      detallesVenta: v.detallesVenta,
      total: v.total,
    }));
  }

  static toDeleteResponse(id: number) {
    return {
      message: `La venta con id ${id} se elimino exitosamente `,
    };
  }
}
