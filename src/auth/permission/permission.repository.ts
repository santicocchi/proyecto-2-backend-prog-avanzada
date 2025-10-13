import { HttpException, Injectable } from "@nestjs/common";
import { IPermissionRepository} from "./IPermissionRepository.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntity } from "./entities/permission.entity";


@Injectable()
export class PermissionRepository implements IPermissionRepository {
    constructor(
        @InjectRepository(PermissionEntity)
        private readonly repository: Repository<PermissionEntity>,
    ) { }
    findAll(): Promise<PermissionEntity[]> {
        throw new Error("Method not implemented.");
    }
    findOneBy(filter: Partial<PermissionEntity>): Promise<PermissionEntity | null> {
        throw new Error("Method not implemented.");
    }
    findOne(options: any): Promise<PermissionEntity | null> {
        throw new Error("Method not implemented.");
    }
    save(entity: PermissionEntity): Promise<PermissionEntity> {
        throw new Error("Method not implemented.");
    }
    delete(filter: Partial<PermissionEntity>): Promise<void> {
        throw new Error("Method not implemented.");
    }




}