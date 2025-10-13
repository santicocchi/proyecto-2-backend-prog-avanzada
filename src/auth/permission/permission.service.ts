import { HttpException, Injectable } from '@nestjs/common';
import { PermissionDto } from './dtos/permission.dto';
import { PermissionEntity } from './entities/permission.entity';

@Injectable()
export class PermissionService {
    repository = PermissionEntity

    async create(body: PermissionDto ): Promise<PermissionEntity> {
        try {
            const permission = new PermissionEntity();
            Object.assign(permission,body);
            return await this.repository.save(permission);
        } catch (error) {
            throw new HttpException(error.message ?? "Error al crear el permiso", error.status ?? 500)
        }
    }

    async list():Promise<PermissionEntity[]>{
        try{
            return await this.repository.find()
        }catch(error){
            throw new HttpException(error.message ?? "Error al obtener los permisos :(", error.status ?? 500)
        }
    }

    async update(params:{id?:number},body:{permissionDto:PermissionDto}):Promise<PermissionEntity>{
        try{
            const id = params.id
            if (id === undefined) {
                throw new HttpException('Id is required', 400);
            }
            try{
                await this.repository.findOneOrFail({
                    where:{id}
                })
            }catch(error){
                throw new HttpException(`Permiso con id: ${id} no encontrado`,500)
            }
            const permission = new PermissionEntity()
            Object.assign(permission,body.permissionDto)
            await this.repository.update(id,permission)
            const response = await this.repository.findOneOrFail({
                where:{id}
            })
            return response
        }catch(error){
            throw new HttpException(error.message?? "Error al actualizar el permiso",error.status?? 500)
        }
    }

    async delete(params:{id:number}):Promise<String>{
        const id = params.id
        try{
            try{
                await this.repository.findOneOrFail({
                    where:{id}
                })
            }catch(error){
                throw new HttpException(`Permiso con id: ${id} no encontrado`,500)
            }
            await this.repository.delete(id)
            return `Permiso con id: ${id} eliminado con exito`
        }catch(error){
            throw new HttpException(error.message?? "Error al eliminar el permiso",error.status?? 500)
        }
    }
    
}
