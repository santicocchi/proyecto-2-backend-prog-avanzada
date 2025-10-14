import { Proveedor } from '../entities/proveedor.entity';

export class ProveedorMapper {
  static toResponse(proveedor: Proveedor) {
    if (!proveedor) return null;
    return {
      id: proveedor.id,
      nombre: proveedor.nombre,
      direccion: proveedor.direccion,
      cuit: proveedor.cuit,
      createdAt: proveedor.createdAt,
      updatedAt: proveedor.updatedAt,
    };
  }

  static toListResponse(proveedores: Proveedor[]) {
    return proveedores.map(p => ({
      id: p.id,
      nombre: p.nombre,
      cuit: p.cuit,
    }));
  }

  static toCreateResponse(proveedor: Proveedor) {
    return {
      id: proveedor.id,
      nombre: proveedor.nombre,
      direccion: proveedor.direccion,
      cuit: proveedor.cuit,
      createdAt: proveedor.createdAt,
    };
  }

  static toDeleteResponse(proveedor: Proveedor) {
    return {
      message: `El proveedor ${proveedor.nombre} con id ${proveedor.id} fue eliminado exitosamente.`
    };
  }
}
