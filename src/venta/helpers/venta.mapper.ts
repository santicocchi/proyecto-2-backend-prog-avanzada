export class VentaMapper {
  static toResponse(venta: any) {
    return {
      id: venta.id,
      fecha: venta.fecha_venta,
      cliente: venta.cliente.nombre + ' ' + venta.cliente.apellido + ' - ' + venta.cliente.num_documento,
      responsable: venta.responsable.id + ' - ' + venta.responsable.email + ' - ',
      formaPago: venta.formaPago.nombre,
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
      cliente: v.cliente.nombre + ' ' + v.cliente.apellido + ' - ' + v.cliente.num_documento,
      responsable: v.responsable.id + ' - ' + v.responsable.email,
      formaPago: v.formaPago.nombre,
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
