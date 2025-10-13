import { HttpException, Injectable } from '@nestjs/common';
import { RoleDto } from './dtos/role.dto';
import { SetPermissionDto } from './dtos/setPermission.dto';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '../permission/entities/permission.entity';

@Injectable()
export class RoleService {
    repository = RoleEntity
    repositoryPermission = PermissionEntity

    async create(body: RoleDto): Promise<RoleEntity> {
        try {
            const role = new RoleEntity();
            Object.assign(role, body);

            return await this.repository.save(role);
        } catch (error) {
            throw new HttpException(error.message ?? "Error al crear el rol", error.status ?? 500)
        }
    }

    async list(): Promise<RoleEntity[]> {
        try {
            return await this.repository.find({ relations: ['permissionCodes'] })
        } catch (error) {
            throw new HttpException(error.message ?? "Error al obtener los roles :(", error.status ?? 500)
        }
    }

    async listarRolesPorUsuario(id: number): Promise<RoleEntity[]> {
        try {
            let role: RoleEntity[] = await this.repository.find({ where: { user: { id } } })
            role.map(role => role.permissionCodes = [])
            return role
        } catch (error) {
            throw new HttpException(error.message ?? "Error al obtener los roles del usuario", error.status ?? 500)
        }
    }

    async findByName(name: string): Promise<RoleEntity> {
        try {
            const role = await this.repository.findOne({
                where: { name },
                relations: ['permissionCodes'],
            });

            if (!role) {
                throw new HttpException(`Rol con nombre "${name}" no encontrado`, 404);
            }

            return role;
        } catch (error) {
            throw new HttpException(
                error.message ?? "Error al buscar el rol por nombre",
                error.status ?? 500
            );
        }
    }


    async update(params: { id?: number }, body: { roleDto: RoleDto }): Promise<RoleEntity> {
        try {
            const id = params.id;
            if (id === undefined) {
                throw new HttpException('Id is required', 400);
            }

            try {
                await this.repository.findOneOrFail({
                    where: { id }
                })
            } catch (error) {
                throw new HttpException(`Rol con id: ${id} no encontrado`, 500)
            }
            const role = new RoleEntity()
            Object.assign(role, body.roleDto)
            await this.repository.update(id, role);
            const response = await this.repository.findOneOrFail({
                where: { id }
            })
            return response
        } catch (error) {
            throw new HttpException(error.message ?? "Error al actualizar el rol", error.status ?? 500)
        }
    }

    async delete(params: { id: number }): Promise<String> {
        const id = params.id
        try {
            try {
                await this.repository.findOneOrFail({
                    where: { id }
                })
            } catch (error) {
                throw new HttpException(`Rol con id: ${id} no encontrado`, 500)
            }
            await this.repository.delete(id)
            return `Rol con id: ${id} eliminado con exito`
        } catch (error) {
            throw new HttpException(error.message ?? "Error al eliminar el rol", error.status ?? 500)
        }
    }

    async setPermission(params: { id: number }, body: SetPermissionDto): Promise<RoleEntity> {
        try {
            const id = params.id
            const role = await this.repository.findOne({ where: { id }, relations: ['permissionCodes'] })
            if (!role) {
                throw new HttpException("Rol no encontrado", 404)
            }

            const permission = await this.repositoryPermission.findOne({ where: { id: body.id } })
            if (!permission) {
                throw new HttpException("Permiso no encontrado", 404)
            }

            if (!role.permissionCodes) {
                role.permissionCodes = [];
            }

            role.permissionCodes.push(permission);
            return await this.repository.save(role);

        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }
}
