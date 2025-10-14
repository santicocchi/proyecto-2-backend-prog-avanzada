export interface IDetalleVentaRepository {
  create(data: any): Promise<any>;
  findOne(id: number): Promise<any>;
  update(id: number, data: any): Promise<any>;
  softDelete(id: number): Promise<any>;
}