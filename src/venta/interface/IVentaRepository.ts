export interface IVentaRepository {
  create(data: any): Promise<any>;
  findAll(order?: 'ASC' | 'DESC'): Promise<any[]>;
  findAdvanced(filter: any): Promise<any[]>;
  findOne(id: number): Promise<any>;
  update(id: number, data: any): Promise<any>;
  softDelete(id: number): Promise<any>;
}