import { Linea } from '../entities/linea.entity';

export class LineaMapper {
  static toResponse(linea: Linea) {
    if (!linea) return null;
    return {
      id: linea.id,
      nombre: linea.nombre,
      marcas: linea.marcas?.map(m => ({ id: m.id, nombre: m.nombre })) || [],
      createdAt: linea.createdAt,
      updatedAt: linea.updatedAt,
    };
  }

  static toListResponse(lineas: Linea[]) {
    return lineas.map(l => ({
      id: l.id,
      nombre: l.nombre,
    }));
  }

  static toCreateResponse(linea: Linea) {
    return {
      id: linea.id,
      nombre: linea.nombre,
      createdAt: linea.createdAt,
    };
  }

  static toUpdateResponse(linea: Linea) {
    return {
      id: linea.id,
      nombre: linea.nombre,
      marcas: linea.marcas?.map(m => ({ id: m.id, nombre: m.nombre })) || [],
      updatedAt: linea.updatedAt,
    };
  }

  static toDeleteResponse(linea: Linea) {
    return {
      message: `La Linea ${linea.nombre} con id ${linea.id} fue eliminada exitosamente.`
    };
  }
}
