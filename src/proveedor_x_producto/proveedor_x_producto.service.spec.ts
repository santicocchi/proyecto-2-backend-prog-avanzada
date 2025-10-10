import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorXProductoService } from './proveedor_x_producto.service';

describe('ProveedorXProductoService', () => {
  let service: ProveedorXProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProveedorXProductoService],
    }).compile();

    service = module.get<ProveedorXProductoService>(ProveedorXProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
