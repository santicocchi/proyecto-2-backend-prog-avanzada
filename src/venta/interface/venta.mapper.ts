import { Venta } from "../entities/venta.entity";

//src/venta/helpers/venta.mapper.ts
export class VentaMapper {
  static toCreateResponse(venta: Venta) {
    return {
      id: venta.id,
      fecha: venta.fecha_venta,
      cliente: `${venta.cliente.nombre} ${venta.cliente.apellido}`,
      responsable: venta.responsable.email,
      formaPago: venta.formaPago.nombre,
      detallesVenta: venta.detallesVenta.map((d) => ({
        producto: d.producto?.nombre,
        descripcion: d.producto?.descripcion,
        precio_sin_impuesto: d.producto?.precio_sin_impuesto,
        precio_impuesto: d.producto?.precio_con_impuesto,
        cantidad: d.cantidad,
        subtotal: d.subtotal, // opcional, podés quitarlo si no querés mostrarlo
      })),
      total: venta.total,
      createdAt: venta.createdAt,
    };
  }

  static toListResponse(ventas: Venta[]) {
    return ventas.map(v => ({
      id: v.id,
      fecha: v.fecha_venta,
      cliente: `${v.cliente.nombre} ${v.cliente.apellido}`,
      responsable: v.responsable.email,
      formaPago: v.formaPago.nombre,
      // detallesVenta: v.detallesVenta,
      total: v.total,
    }));
  }

  static toResponse(venta: Venta) {
    return {
      id: venta.id,
      fecha: venta.fecha_venta,
      cliente: `${venta.cliente.nombre} ${venta.cliente.apellido}`,
      documento: `${venta.cliente.tipo_documento.nombre} ${venta.cliente.num_documento}`,
      telefono_cliente: venta.cliente.telefono,
      responsable: venta.responsable.email,
      formaPago: venta.formaPago.nombre,
      detallesVenta: venta.detallesVenta.map((d) => ({
        producto: d.producto?.nombre,
        descripcion: d.producto?.descripcion,
        precio_sin_impuesto: d.producto?.precio_sin_impuesto,
        impuesto: d.producto?.impuesto,
        precio_impuesto: d.producto?.precio_con_impuesto,
        marca: d.producto?.marca?.nombre,
        linea: d.producto?.linea?.nombre,
        cantidad: d.cantidad,
        subtotal: d.subtotal, // opcional, podés quitarlo si no querés mostrarlo
      })),
      total: venta.total,
      createdAt: venta.createdAt,
      updatedAt: venta.updatedAt,
    };
  }

  static toDeleteResponse(id: number) {
    return {
      message: `La venta con id ${id} se elimino exitosamente `,
    };
  }
}
