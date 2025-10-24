//src/venta/interface/IVentaRepository.ts
import { UpdateVentaDto } from "../dto/update-venta.dto";
import { Venta } from "../entities/venta.entity";

export interface IVentaRepository {
  create(data: Venta): Promise<Venta>;
  // findAll(order?: 'ASC' | 'DESC'): Promise<Venta[]>;
  findAdvanced(filter: any): Promise<[Venta[], number]> ;
  findOne(id: number): Promise<Venta>;
  update(id: number, data: UpdateVentaDto): Promise<Venta>;
  softDelete(id: number): Promise<void>;
}