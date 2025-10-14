import { Cliente } from '../entities/cliente.entity';

export class ClienteMapper {
  static toResponse(cliente: Cliente) {
    return {
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      tipo_documento: cliente.tipo_documento,
      num_documento: cliente.num_documento,
      telefono: cliente.telefono,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
    };
  }

  static toResponseList(clientes: Cliente[]) {
    return clientes.map(this.toResponse);
  }
}
