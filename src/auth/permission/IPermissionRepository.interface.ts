import { PermissionEntity } from "./entities/permission.entity";

// src/common/interfaces/irepository.interface.ts
export interface IPermissionRepository {
  findAll(): Promise<PermissionEntity[]>;
  findOneBy(filter: Partial<PermissionEntity>): Promise<PermissionEntity | null>;
  findOne(options: any): Promise<PermissionEntity | null>;
  save(entity: PermissionEntity): Promise<PermissionEntity>;
  delete(filter: Partial<PermissionEntity>): Promise<void>;
}
