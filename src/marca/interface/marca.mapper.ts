import { Marca } from '../entities/marca.entity';

export class MarcaMapper {
  static toResponse(marca: Marca) {
    if (!marca) return null;
    return {
      id: marca.id,
      nombre: marca.nombre,
      createdAt: marca.createdAt,
      updatedAt: marca.updatedAt,
      lineas: marca.lineas?.map(l => ({ id: l.id, nombre: l.nombre })) || [],
    };
  }

  static toListResponse(marcas: Marca[]) {
    return marcas.map(m => ({
      id: m.id,
      nombre: m.nombre,
      lineas: m.lineas?.map(l => ({ id: l.id, nombre: l.nombre })) || [],
    }));
  }

  static toCreateResponse(marca: Marca) {
    return {
      id: marca.id,
      nombre: marca.nombre,
      createdAt: marca.createdAt,
      lineas: marca.lineas?.map(l => ({ id: l.id, nombre: l.nombre })) || [],
    };
  }

  static toDeleteResponse(marca: Marca) {
    return {
      message: `La marca ${marca.nombre} con id ${marca.id} fue eliminada exitosamente.`
    };
  }
}
