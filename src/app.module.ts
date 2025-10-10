import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineaModule } from './linea/linea.module';
import { MarcaModule } from './marca/marca.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ProductoModule } from './producto/producto.module';
import { DetalleVentaModule } from './detalle_venta/detalle_venta.module';
import { VentaModule } from './venta/venta.module';
import { FormaPagoModule } from './forma_pago/forma_pago.module';
import { ClienteModule } from './cliente/cliente.module';
import { TipoDocumentoModule } from './tipo_documento/tipo_documento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { PermisoModule } from './permiso/permiso.module';
import { ProveedorXProductoModule } from './proveedor_x_producto/proveedor_x_producto.module';

@Module({
  imports: [LineaModule, MarcaModule, ProveedorModule, ProductoModule, DetalleVentaModule, VentaModule, FormaPagoModule, ClienteModule, TipoDocumentoModule, UsuarioModule, RolModule, PermisoModule, ProveedorXProductoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
