import { FormaPago } from '../entities/forma_pago.entity';

export class FormaPagoMapper {
  static toCreateResponse(formaPago: FormaPago) {
    return {
      id: formaPago.id,
      nombre: formaPago.nombre,
      createdAt: formaPago.createdAt,
    };
  }

  static toListResponse(formasPago: FormaPago[]) {
    return formasPago.map(fp => ({
      id: fp.id,
      nombre: fp.nombre,
    }));
  }

  static toGetResponse(formaPago: FormaPago) {
    return {
      id: formaPago.id,
      nombre: formaPago.nombre,
      createdAt: formaPago.createdAt,
      updatedAt: formaPago.updatedAt,
    };
  }

  static toUpdateResponse(formaPago: FormaPago) {
    return {
      id: formaPago.id,
      nombre: formaPago.nombre,
      updatedAt: formaPago.updatedAt,
    };
  }

  static toDeleteResponse(formaPago: FormaPago) {
    return {
      message: `La forma de pago ${formaPago.nombre} con id ${formaPago.id} fue eliminada exitosamente`,
    };
  }
}
