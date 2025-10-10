import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorXProductoController } from './proveedor_x_producto.controller';
import { ProveedorXProductoService } from './proveedor_x_producto.service';

describe('ProveedorXProductoController', () => {
  let controller: ProveedorXProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProveedorXProductoController],
      providers: [ProveedorXProductoService],
    }).compile();

    controller = module.get<ProveedorXProductoController>(ProveedorXProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
