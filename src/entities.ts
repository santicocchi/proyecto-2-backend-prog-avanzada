import { PermissionEntity } from "src/auth/permission/entities/permission.entity";
import { RoleEntity } from "src/auth/role/entities/role.entity";
import { UserEntity } from "src/auth/users/entities/user.entity";
import { Linea } from "./linea/entities/linea.entity";
import { Marca } from "./marca/entities/marca.entity";
import { Proveedor } from "./proveedor/entities/proveedor.entity";
import { Producto } from "./producto/entities/producto.entity";
import { DetalleVenta } from "./detalle_venta/entities/detalle_venta.entity";
import { Venta } from "./venta/entities/venta.entity";
import { FormaPago } from "./forma_pago/entities/forma_pago.entity";
import { Cliente } from "./cliente/entities/cliente.entity";
import { TipoDocumento } from "./tipo_documento/entities/tipo_documento.entity";
import { ProveedorXProducto } from "./proveedor_x_producto/entities/proveedor_x_producto.entity";



export const entities = [RoleEntity, UserEntity, PermissionEntity, 
    Linea, Marca, Proveedor, Producto, DetalleVenta, Venta, 
    FormaPago, Cliente, TipoDocumento, ProveedorXProducto]