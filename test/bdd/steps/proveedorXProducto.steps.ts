import { defineFeature, loadFeature } from 'jest-cucumber';
import { Producto } from 'src/producto/entities/producto.entity';
import { IProductoRepository } from 'src/producto/interface/IProductoRepository';
import { ProductoService } from 'src/producto/producto.service';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from 'src/producto/dto/create-producto.dto';
import { Marca } from 'src/marca/entities/marca.entity';
import { Linea } from 'src/linea/entities/linea.entity';
import { ProveedorXProductoService } from 'src/proveedor_x_producto/proveedor_x_producto.service';
import { IProveedorXProductoRepository } from 'src/proveedor_x_producto/interface/IProveedorXProductoRepository';
import { create } from 'domain';
import { ProveedorXProducto } from 'src/proveedor_x_producto/entities/proveedor_x_producto.entity';
import { CreateProveedorXProductoDto } from 'src/proveedor_x_producto/dto/create-proveedor_x_producto.dto';
import { UpdateProveedorXProductoDto } from 'src/proveedor_x_producto/dto/update-proveedor_x_producto.dto';


const feature = loadFeature('./test/bdd/features/proveedorXProducto.feature');

defineFeature(feature, (test) => {
    let service: ProveedorXProductoService;
    let mockRepo: jest.Mocked<IProveedorXProductoRepository>;
    let result: any;
    let error: any;
    let mockPoveedorXProductoDbRes: any = {
        id: 1,
        producto: {
            id: 1,
            nombre: 'Producto A',
            descripcion: 'Descripción del producto A',
            precio_sin_impuesto: 1000,
            impuesto: 21,
            precio_con_impuesto: 1021,
            stock: 10,
            marca: {
                id: 1,
                nombre: 'MarcaX',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            linea: {
                id: 1,
                nombre: 'LíneaY',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        },
        proveedor: {
            id: 1,
            nombre: 'Proveedor1',
            direccion: 'Direccion Proveedor1',
            cuit: '20123456789',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        },
        precio_proveedor: 950,
        codigo_proveedor: '12345678',
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-02-01T00:00:00.000Z'),
        deletedAt: null
    };


    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    producto: {
                        id: 1,
                        nombre: 'Producto A',
                        descripcion: 'Descripción del producto A',
                        precio_sin_impuesto: 1000,
                        impuesto: 21,
                        precio_con_impuesto: 1021,
                        stock: 10,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null
                    },
                    proveedor: {
                        id: 1,
                        nombre: 'Proveedor1',
                        direccion: 'Direccion Proveedor1',
                        cuit: '20123456789',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                    },
                    precio_proveedor: 950,
                    codigo_proveedor: '12345678',
                    createdAt: new Date('2021-01-01T00:00:00.000Z'),
                    updatedAt: new Date('2021-02-01T00:00:00.000Z'),
                    deletedAt: null
                } as ProveedorXProducto,
                {
                    id: 2,
                    producto: {
                        id: 2,
                        nombre: 'Producto B',
                        descripcion: 'Descripción del producto B',
                        precio_sin_impuesto: 2000,
                        impuesto: 21,
                        precio_con_impuesto: 2021,
                        stock: 10,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null
                    },
                    proveedor: {
                        id: 1,
                        nombre: 'Proveedor1',
                        direccion: 'Direccion Proveedor1',
                        cuit: '20123456789',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                    },
                    precio_proveedor: 1000,
                    codigo_proveedor: '12345678',
                    createdAt: new Date('2021-03-01T00:00:00.000Z'),
                    updatedAt: new Date('2021-04-01T00:00:00.000Z'),
                    deletedAt: null
                } as ProveedorXProducto,
            ]),
            findById: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockPoveedorXProductoDbRes.deletedAt === null) {
                    return mockPoveedorXProductoDbRes
                }
                return null;
            }),
            create: jest.fn().mockImplementation(async (dto: CreateProveedorXProductoDto) => {
                let poveedorXProducto = new ProveedorXProducto();
                poveedorXProducto.id = 1
                poveedorXProducto.createdAt = new Date('2021-01-01T00:00:00.000Z');
                poveedorXProducto = Object.assign(poveedorXProducto, dto);
                return poveedorXProducto
            }),
            update: jest.fn().mockImplementation(async (id: number, dto: UpdateProveedorXProductoDto) => {
                if (id === 1) {
                    dto.updatedAt = new Date('2025-10-22T04:35:28.285Z');
                    let poveedorXProducto = new ProveedorXProducto();
                    poveedorXProducto = mockPoveedorXProductoDbRes 
                    const response = Object.assign(poveedorXProducto, dto);
                    return response
                }
                return null;
            }),
            softDelete: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockPoveedorXProductoDbRes.deletedAt === null) {
                    mockPoveedorXProductoDbRes.deletedAt = new Date();
                    return true;
                }
                return false;
            }),
        };




        service = new ProveedorXProductoService(
            mockRepo as any,
        );

        result = null;
        error = null;
    });


    // --- Crear un proveedorXProducto ---
    test('Crear un proveedorXProducto', ({ given, when, then }) => {
        let nuevoProveedorXProducto: any;

        given('un nuevo proveedorXProducto válido', () => {

            nuevoProveedorXProducto = {
                producto: {
                    id: 1,
                    nombre: 'Producto A',
                    descripcion: 'Descripción del producto A',
                    precio_sin_impuesto: 1000,
                    impuesto: 21,
                    precio_con_impuesto: 1021,
                    stock: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null
                },
                proveedor: {
                    id: 1,
                    nombre: 'Proveedor1',
                    direccion: 'Direccion Proveedor1',
                    cuit: '20123456789',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
                precio_proveedor: 950,
                codigo_proveedor: '12345678',
                updatedAt: null,
                deletedAt: null
            } as ProveedorXProducto


            //   service.create.mockResolvedValue(nuevoProducto);
        });

        when('lo creo mediante create', async () => {
            result = await service.create(nuevoProveedorXProducto);
        });

        then('debería recibir el proveedorXProducto creado con los datos correctos', () => {
            expect(result.id).toBe(1);
            expect(result.producto.id).toBe(1);
            expect(result.producto.nombre).toBe('Producto A');
            expect(result.producto.descripcion).toBe('Descripción del producto A');
            expect(result.producto.precio_sin_impuesto).toBe(1000);
            expect(result.producto.impuesto).toBe(21);
            expect(result.producto.precio_con_impuesto).toBe(1021);
            expect(result.producto.stock).toBe(10);
            expect(result.proveedor.id).toBe(1);
            expect(result.proveedor.nombre).toBe('Proveedor1');
            expect(result.proveedor.direccion).toBe('Direccion Proveedor1');
            expect(result.proveedor.cuit).toBe('20123456789');
            expect(result.precio_proveedor).toBe(950);
            expect(result.codigo_proveedor).toBe('12345678');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.createdAt).toStrictEqual(new Date('2021-01-01T00:00:00.000Z'));
        });
    });

    test('Obtener todos los proveedoresXProductos', ({ given, when, then }) => {
        given('que existen proveedoresXProductos en la base de datos', () => {
            // No hace falta hacer nada, el mockRepo.findAll ya tiene datos resueltos
        });

        when('solicito todos los proveedoresXProductos mediante findAll', async () => {
            result = await service.findAll();
        });

        then('debería recibir una lista de proveedoresXProductos mapeados correctamente', () => {
            expect(result.length).toBe(2);
            expect(result[0].id).toBe(1);
            expect(result[0].producto.id).toBe(1);
            expect(result[0].producto.nombre).toBe('Producto A');
            expect(result[0].producto.descripcion).toBe('Descripción del producto A');
            expect(result[0].producto.precio_sin_impuesto).toBe(1000);
            expect(result[0].producto.impuesto).toBe(21);
            expect(result[0].producto.precio_con_impuesto).toBe(1021);
            expect(result[0].producto.stock).toBe(10);
            expect(result[0].proveedor.id).toBe(1);
            expect(result[0].proveedor.nombre).toBe('Proveedor1');
            expect(result[0].proveedor.direccion).toBe('Direccion Proveedor1');
            expect(result[0].proveedor.cuit).toBe('20123456789');
            expect(result[0].precio_proveedor).toBe(950);
            expect(result[0].codigo_proveedor).toBe('12345678');
            expect(result[0].createdAt).toBe(undefined);
            expect(result[0].updatedAt).toBe(undefined);
            expect(result[0].deletedAt).toBe(undefined);
            expect(result[1].id).toBe(2);
            expect(result[1].producto.id).toBe(2);
            expect(result[1].producto.nombre).toBe('Producto B');
            expect(result[1].producto.descripcion).toBe('Descripción del producto B');
            expect(result[1].producto.precio_sin_impuesto).toBe(2000);
            expect(result[1].producto.impuesto).toBe(21);
            expect(result[1].producto.precio_con_impuesto).toBe(2021);
            expect(result[1].producto.stock).toBe(10);
            expect(result[1].proveedor.id).toBe(1);
            expect(result[1].proveedor.nombre).toBe('Proveedor1');
            expect(result[1].proveedor.direccion).toBe('Direccion Proveedor1');
            expect(result[1].proveedor.cuit).toBe('20123456789');
            expect(result[1].precio_proveedor).toBe(1000);
            expect(result[1].codigo_proveedor).toBe('12345678');
            expect(result[1].createdAt).toBe(undefined);
            expect(result[1].updatedAt).toBe(undefined);
            expect(result[1].deletedAt).toBe(undefined);
        });
    });

    // --- Buscar un proveedorXProducto existente ---
    test('Buscar un proveedorXProducto por id', ({ given, when, then }) => {
        // const producto = { id: 1, nombre: 'Notebook' } as Producto;

        given('que existe un proveedorXProducto con id 1', () => {
            const res = mockRepo.findById(1)
            console.log('respuesta mock findById:', res);
        });

        when('lo busco mediante findOne', async () => {
            result = await service.findOne(1);
            // console.log('resultado de findOne:', result);
        });

        then('debería recibir el proveedorXProducto con id 1', () => {
            expect(result.id).toBe(1);
            expect(result.producto.id).toBe(1);
            expect(result.producto.nombre).toBe('Producto A');
            expect(result.producto.descripcion).toBe('Descripción del producto A');
            expect(result.producto.precio_sin_impuesto).toBe(1000);
            expect(result.producto.impuesto).toBe(21);
            expect(result.producto.precio_con_impuesto).toBe(1021);
            expect(result.producto.stock).toBe(10);
            expect(result.proveedor.id).toBe(1);
            expect(result.proveedor.nombre).toBe('Proveedor1');
            expect(result.proveedor.direccion).toBe('Direccion Proveedor1');
            expect(result.proveedor.cuit).toBe('20123456789');
            expect(result.precio_proveedor).toBe(950);
            expect(result.codigo_proveedor).toBe('12345678');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.createdAt).toStrictEqual(new Date('2021-01-01T00:00:00.000Z'));
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toStrictEqual(new Date('2021-02-01T00:00:00.000Z'));
            expect(result.deletedAt).toBe(undefined);
        });
    });


    // --- Buscar un proveedorXProducto inexistente ---
    test('Buscar un proveedorXProducto inexistente', ({ given, when, then }) => {
        given('que no existe un proveedorXProducto con id 999', () => {
            // mockRepo.findById.mockResolvedValue(null);
        });

        when('lo busco mediante findOne', async () => {
            try {
                const res = await service.findOne(999);
                // if (!res) throw new NotFoundException('Producto no encontrado');
            } catch (err) {
                error = err;
            }
        });

        then('debería lanzar un error "Relación proveedor-producto no encontrada"', () => {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe('Relación proveedor-producto no encontrada');
        });
    });

    // --- Actualizar un proveedorXProducto ---
    test('Actualizar un proveedorXProducto existente', ({ given, when, then }) => {
        const proveedorXProductoActualizado = { id: 1, precio_proveedor: 1200 } as ProveedorXProducto;

        given('un proveedorXProducto existente con id 1', () => {
            // mockRepo.update.mockResolvedValue(productoActualizado);
        });

        when('actualizo el proveedorXProducto con un nuevo precio 1200', async () => {
            result = await service.update(1, proveedorXProductoActualizado);
        });

        then('debería recibir el proveedorXProducto actualizado con precio 1200', () => {
            // expect(result.nombre).toBe('Monitor Gamer');
            expect(result.id).toBe(1);
            expect(result.producto.id).toBe(1);
            expect(result.producto.nombre).toBe('Producto A');
            expect(result.producto.descripcion).toBe('Descripción del producto A');
            expect(result.producto.precio_sin_impuesto).toBe(1000);
            expect(result.producto.impuesto).toBe(21);
            expect(result.producto.precio_con_impuesto).toBe(1021);
            expect(result.producto.stock).toBe(10);
            expect(result.proveedor.id).toBe(1);
            expect(result.proveedor.nombre).toBe('Proveedor1');
            expect(result.proveedor.direccion).toBe('Direccion Proveedor1');
            expect(result.proveedor.cuit).toBe('20123456789');
            expect(result.precio_proveedor).toBe(1200);
            expect(result.codigo_proveedor).toBe('12345678');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.createdAt).toStrictEqual(new Date('2021-01-01T00:00:00.000Z'));
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toStrictEqual(new Date('2025-10-22T04:35:28.285Z'));
            expect(result.deletedAt).toBe(undefined);
        });
    });


    // --- Eliminar un proveedorXProducto ---
    test('Eliminar un proveedorXProducto existente', ({ given, when, then }) => {
        given('un proveedorXProducto existente con id 1', () => {
            const res = mockRepo.findById(1);
            if (!res) throw new Error('ProveedorXProducto mock no encontrado');
        });

        when('elimino el proveedorXProducto mediante softDelete', async () => {
            result = await service.remove(1);
        });

        then('debería confirmar que el proveedorXProducto se eliminó correctamente', () => {
            expect(result).toStrictEqual({ message: 'La relación proveedor-producto con id 1 fue eliminada exitosamente.' });
            expect(service.findOne(1)).rejects.toThrow('Relación proveedor-producto no encontrada');
        });
    });

      // --- Error al crear un proveedorXProducto ---
  test('Error al crear un proveedorXProducto', ({ given, when, then }) => {
    given('un error inesperado al intentar crear un proveedorXProducto', () => {
      mockRepo.create.mockRejectedValue(new Error('DB connection lost'));
    });

    when('ejecuto create', async () => {
      try {
        await service.create({} as any);
      } catch (err) {
        error = err;
      }
    });

    then('debería lanzar un error "Error al crear la relación proveedor-producto"', () => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Error al crear la relación proveedor-producto');
    });
  });

  // --- Error al obtener todos los proveedoresXProductos ---
  test('Error al obtener todos los proveedoresXProductos', ({ given, when, then }) => {
    given('un error inesperado al intentar obtener todos los proveedoresXProductos', () => {
      mockRepo.findAll.mockRejectedValue(new Error('DB query failed'));
    });

    when('ejecuto findAll', async () => {
      try {
        await service.findAll();
      } catch (err) {
        error = err;
      }
    });

    then('debería lanzar un error "Error al obtener las relaciones proveedor-producto"', () => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Error al obtener las relaciones proveedor-producto');
    });
  });

  // --- Error inesperado en findOne ---
  test('Error inesperado al buscar un proveedorXProducto', ({ given, when, then }) => {
    given('un error inesperado al intentar obtener un proveedorXProducto', () => {
      mockRepo.findById.mockRejectedValue(new Error('DB timeout'));
    });

    when('ejecuto findOne', async () => {
      try {
        await service.findOne(1);
      } catch (err) {
        error = err;
      }
    });

    then('debería lanzar un error "Error al obtener la relación proveedor-producto"', () => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Error al obtener la relación proveedor-producto');
    });
  });

  // --- Error inesperado en update ---
  test('Error inesperado al actualizar un proveedorXProducto', ({ given, when, then }) => {
    given('un error inesperado al intentar actualizar un proveedorXProducto', () => {
      mockRepo.update.mockRejectedValue(new Error('Transaction rollback'));
    });

    when('ejecuto update', async () => {
      try {
        await service.update(1, {} as any);
      } catch (err) {
        error = err;
      }
    });

    then('debería lanzar un error "Error al actualizar la relación proveedor-producto"', () => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Error al actualizar la relación proveedor-producto');
    });
  });

  // --- Error inesperado en remove ---
  test('Error inesperado al eliminar un proveedorXProducto', ({ given, when, then }) => {
    given('un error inesperado al intentar eliminar un proveedorXProducto', () => {
      mockRepo.findById.mockRejectedValue(new Error('Disk failure'));
    });

    when('ejecuto remove', async () => {
      try {
        await service.remove(1);
      } catch (err) {
        error = err;
      }
    });

    then('debería lanzar un error "Error al eliminar la relación proveedor-producto"', () => {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Error al eliminar la relación proveedor-producto');
    });
  });

});
