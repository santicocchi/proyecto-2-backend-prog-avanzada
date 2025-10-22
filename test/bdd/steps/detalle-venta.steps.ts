import { defineFeature, loadFeature } from 'jest-cucumber';
import { DetalleVentaService } from 'src/detalle_venta/detalle_venta.service';
import { IDetalleVentaRepository } from 'src/detalle_venta/interface/IDetalleVentaRepository';
import { IProductoRepository } from 'src/producto/interface/IProductoRepository';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { CreateDetalleVentaInput } from 'src/venta/dto/create-venta.dto';
import { EntityManager } from 'typeorm';

const feature = loadFeature('./test/bdd/features/detalle-venta.feature');

defineFeature(feature, test => {
  let service: DetalleVentaService;
  let mockRepository: Partial<IDetalleVentaRepository>;
  let mockProductoRepo: Partial<IProductoRepository>;
  let resultado: any;
  let error: any;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
    mockProductoRepo = {
      findById: jest.fn(),
    };
    service = new DetalleVentaService(
      mockRepository as any,
      mockProductoRepo as any,
    );
    resultado = null;
    error = null;
  });

  test('Crear detalles de venta', ({ given, when, then }) => {
    let detallesInput: CreateDetalleVentaInput[];
    let manager: EntityManager = {
      save: jest.fn(async entity => entity),
      create: jest.fn((cls, data) => data),
    } as any;

    given('que tengo una lista de detalles de venta válidos', () => {
      detallesInput = [
        { productoId: 1, cantidad: 2 },
        { productoId: 2, cantidad: 1 },
      ];
      mockProductoRepo.findById = jest.fn().mockResolvedValue({ 
        id: 1, nombre: 'Producto 1', stock: 10, precio_con_impuesto: 100 
      });
    });

    when('los creo mediante crearDetalles', async () => {
      try {
        resultado = await service.crearDetalles(detallesInput, manager);
      } catch (err) {
        error = err;
      }
    });

    then('debería recibir los detalles creados con el total calculado correctamente', () => {
      expect(resultado.detalles).toHaveLength(detallesInput.length);
      expect(resultado.total).toBeGreaterThan(0);
    });
  });

  test('Crear detalle con stock insuficiente', ({ given, when, then }) => {
    let detallesInput: CreateDetalleVentaInput[];
    let manager: EntityManager = {
      save: jest.fn(),
      create: jest.fn(),
    } as any;

    given('que un producto tiene stock insuficiente', () => {
      detallesInput = [{ productoId: 1, cantidad: 5 }];
      mockProductoRepo.findById = jest.fn().mockResolvedValue({ 
        id: 1, nombre: 'Producto 1', stock: 2, precio_con_impuesto: 100 
      });
    });

    when('intento crear un detalle con más cantidad de la disponible', async () => {
      try {
        resultado = await service.crearDetalles(detallesInput, manager);
      } catch (err) {
        error = err;
      }
    });

    then('debería lanzar un error de "Stock insuficiente"', () => {
      expect(error).toBeDefined();
      expect(error.response).toContain('Stock insuficiente');
    });
  });

  test('Obtener un detalle de venta existente', ({ given, when, then }) => {
    given('que existe un detalle de venta con id 1', () => {
      mockRepository.findOne = jest.fn().mockResolvedValue({
        id: 1,
        cantidad: 2,
        subtotal: 200,
        producto: { nombre: 'Producto 1' },
      } as DetalleVenta);
    });

    when('lo busco por id', async () => {
      resultado = await service.findOne(1);
    });

    then('debería recibir el detalle mapeado correctamente', () => {
      expect(resultado.producto.nombre).toBe('Producto 1');
      expect(resultado.cantidad).toBe(2);
    });
  });

  test('Actualizar un detalle de venta existente', ({ given, when, then }) => {
    given('que existe un detalle de venta con id 1', () => {
      mockRepository.update = jest.fn().mockResolvedValue({
        id: 1,
        cantidad: 3,
        subtotal: 300,
        producto: { nombre: 'Producto 1' },
      } as DetalleVenta);
    });

    when('actualizo sus datos', async () => {
      resultado = await service.update(1, { cantidad: 3 });
    });

    then('debería devolver el detalle actualizado', () => {
      expect(resultado.cantidad).toBe(3);
      expect(resultado.subtotal).toBe(300);
    });
  });

  test('Eliminar un detalle de venta existente', ({ given, when, then }) => {
    given('que existe un detalle de venta con id 1', () => {
      mockRepository.softDelete = jest.fn().mockResolvedValue(undefined);
    });

    when('lo elimino', async () => {
      resultado = await service.remove(1);
    });

    then('debería recibir confirmación de eliminación', () => {
      expect(resultado.message).toContain('Detalle de venta con id 1 fue eliminado exitosamente');
    });
  });
});
