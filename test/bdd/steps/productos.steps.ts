import { defineFeature, loadFeature } from 'jest-cucumber';
import { Producto } from 'src/producto/entities/producto.entity';
import { IProductoRepository } from 'src/producto/interface/IProductoRepository';
import { ProductoService } from 'src/producto/producto.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from 'src/producto/dto/create-producto.dto';
import { Marca } from 'src/marca/entities/marca.entity';
import { Linea } from 'src/linea/entities/linea.entity';
import { create } from 'domain';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';

const feature = loadFeature('./test/bdd/features/producto.feature');

defineFeature(feature, (test) => {
    let service: ProductoService;
    let mockRepo: jest.Mocked<IProductoRepository>;
    let result: any;
    let error: any;
    let mockProductoDbRes: any = {
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
                        proveedor_x_producto: [
                            {
                                id: 1,
                                proveedor: {
                                    id: 1,
                                    nombre: 'Proveedor1',
                                    direccion: 'Direccion Proveedor1',
                                    cuit: '20-12345678-9',
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    deletedAt: null,
                                },
                                precio_proveedor: 950,
                                codigo_proveedor: '12345678',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                deletedAt: null,
                            },
                            {
                                id: 2,
                                proveedor: {
                                    id: 2,
                                    nombre: 'Proveedor2',
                                    direccion: 'Direccion Proveedor2',
                                    cuit: '20-12345338-9',
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    deletedAt: null,
                                },
                                precio_proveedor: 940,
                                codigo_proveedor: '12345338',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                deletedAt: null
                            }]
                        ,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null
                    };

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    nombre: 'Producto A',
                    marca: { id: 1, nombre: 'MarcaX' },
                    linea: { id: 1, nombre: 'LíneaY' }
                } as Producto,
                {
                    id: 2,
                    nombre: 'Producto B',
                    marca: { id: 1, nombre: 'MarcaX' },
                    linea: { id: 1, nombre: 'LíneaY' }
                } as Producto,
            ]),
            findById: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockProductoDbRes.deletedAt === null) {
                    return mockProductoDbRes
                }
                return null;
            }),
            create: jest.fn(),
            update: jest.fn().mockImplementation(async (id: number, dto: CreateProductoDto) => {
                if(id===1){
                    const response = Object.assign(mockProductoDbRes, dto);
                    return response
                }
                return null;
            }),
            softDelete: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockProductoDbRes.deletedAt === null) {
                    mockProductoDbRes.deletedAt = new Date();
                    return true;
                }
                return false;
            }),
            decreaseStock: jest.fn().mockImplementation(async (id: number, cantidad: number) => {
                if (id === 1) {
                    if (cantidad > mockProductoDbRes.stock) {
                        mockProductoDbRes.stock = 0;
                        return mockProductoDbRes;
                    }
                    mockProductoDbRes.stock -= cantidad;
                    return mockProductoDbRes;
                }
                return null;
            }),
            advancedList: jest.fn(),
        };


        const mockMarca = {
            id: 1,
            nombre: 'MarcaX',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            lineas: [] as any[], // se llenará más abajo
            productos: [],
        } as Marca;

        const mockLinea = {
            id: 1,
            nombre: 'LíneaY',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            marcas: [] as any[],
            productos: [],
        } as Linea;

        // Vinculamos las dos entidades entre sí
        mockMarca.lineas = [mockLinea];
        mockLinea.marcas = [mockMarca];

        const mockMarcaRepo = {
            findById: jest.fn().mockImplementation(async (id: number) => {
                if (id === mockMarca.id) return { id: 1, nombre: 'MarcaX', lineas: [{ id: 1, nombre: 'LíneaY' }] } as Marca;
                return null;
            }),
            findAll: jest.fn(),
        };

        const mockLineaRepo = {
            findById: jest.fn().mockImplementation(async (id: number) => {
                if (id === mockLinea.id) return { id: 1, nombre: 'LíneaY', marcas: [{ id: 1 }] } as Linea;
                return null;
            }),
            findAll: jest.fn(),
        };

        service = new ProductoService(
            mockRepo as any,
            mockMarcaRepo as any,
            mockLineaRepo as any,
        );

        result = null;
        error = null;
    });


    // --- Crear un producto ---
    test('Crear un producto', ({ given, when, then }) => {
        let nuevoProducto: any;

        given('un nuevo producto válido', () => {

            nuevoProducto = {
                // id: 1,
                nombre: 'Notebook',
                descripcion: 'Laptop gamer',
                // precio_sin_impuesto: 1000,
                // impuesto: 21,
                // precio_con_impuesto: 1210,
                stock: 10,
                precio: 1000,
                marcaId: { id: 1, nombre: 'MarcaX', lineas: [{ id: 1, nombre: 'LíneaY' }] } as Marca,
                lineaId: {
                    id: 1,
                    nombre: 'LíneaY',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                    marcas: [] as any[],
                    productos: [],
                } as Linea,

            }
            //   service.create.mockResolvedValue(nuevoProducto);
        });

        when('lo creo mediante create', async () => {
            result = await service.create(nuevoProducto);
        });

        then('debería recibir el producto creado con los datos correctos', () => {
            expect(result).toEqual(nuevoProducto);
            expect(result.nombre).toBe('Notebook');
        });
    });

    test('Obtener todos los productos', ({ given, when, then }) => {
        given('que existen productos en la base de datos', () => {
            // No hace falta hacer nada, el mockRepo.findAll ya tiene datos resueltos
        });

        when('solicito todos los productos mediante findAll', async () => {
            result = await service.findAll();
        });

        then('debería recibir una lista de productos mapeados correctamente', () => {
            expect(result.length).toBe(2);
            // Si ProductoMapper.toListResponse mantiene 'nombre', entonces:
            expect(result[0].nombre).toBe('Producto A');
        });
    });

    // --- Buscar un producto existente ---
    test('Buscar un producto por id', ({ given, when, then }) => {
        // const producto = { id: 1, nombre: 'Notebook' } as Producto;

        given('que existe un producto con id 1', () => {
            const res = mockRepo.findById(1)
            // console.log('respuesta mock findById:', res);
        });

        when('lo busco mediante findById', async () => {
            result = await service.findOne(1);
            // console.log('resultado de findOne:', result);
        });

        then('debería recibir el producto con id 1', () => {
            expect(result.id).toBe(1);
            expect(result.nombre).toBe('Producto A');
            expect(result.descripcion).toBe('Descripción del producto A');
            expect(result.precio_sin_impuesto).toBe(1000);
            expect(result.impuesto).toBe(21);
            expect(result.precio_con_impuesto).toBe(1021);
            expect(result.stock).toBe(10);
            expect(result.marca).toBe('MarcaX');
            expect(result.marca.nombre).toBe(undefined)
            expect(result.linea).toBe('LíneaY');
            expect(result.linea.nombre).toBe(undefined);
            expect(result.proveedores.length).toBe(2);
            expect(result.proveedores[0].nombre).toBe('Proveedor1');
            expect(result.proveedores[1].nombre).toBe('Proveedor2');
            expect(result.proveedores[0].precio_proveedor).toBe(950);
            expect(result.proveedores[1].precio_proveedor).toBe(940);
            expect(result.proveedores[0].codigo_proveedor).toBe('12345678');
            expect(result.proveedores[1].codigo_proveedor).toBe('12345338');
            expect(result.proveedores[0].cuit).toBe(undefined);
            expect(result.proveedores[1].cuit).toBe(undefined);
            expect(result.proveedores[0].direccion).toBe(undefined);
            expect(result.proveedores[1].direccion).toBe(undefined);
            expect(result.proveedores[0].createdAt).toBe(undefined);
            expect(result.proveedores[1].createdAt).toBe(undefined);
            expect(result.proveedores[0].updatedAt).toBe(undefined);
            expect(result.proveedores[1].updatedAt).toBe(undefined);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });


    // --- Buscar un producto inexistente ---
    test('Buscar un producto inexistente', ({ given, when, then }) => {
        given('que no existe un producto con id 999', () => {
            // mockRepo.findById.mockResolvedValue(null);
        });

        when('lo busco mediante findById', async () => {
            try {
                const res = await service.findOne(999);
                // if (!res) throw new NotFoundException('Producto no encontrado');
            } catch (err) {
                error = err;
            }
        });

        then('debería lanzar un error "Producto no encontrado"', () => {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe('Producto no encontrado');
        });
    });

    // --- Actualizar un producto ---
    test('Actualizar un producto existente', ({ given, when, then }) => {
        const productoActualizado = { id: 1, nombre: 'Monitor Gamer' } as Producto;

        given('un producto existente con id 1', () => {
            // mockRepo.update.mockResolvedValue(productoActualizado);
        });

        when('actualizo el producto con un nuevo nombre "Monitor Gamer"', async () => {
            result = await service.update(1, productoActualizado);
        });

        then('debería recibir el producto actualizado con nombre "Monitor Gamer"', () => {
            // expect(result.nombre).toBe('Monitor Gamer');
            expect(result.id).toBe(1);
            expect(result.nombre).toBe('Monitor Gamer');
            expect(result.descripcion).toBe('Descripción del producto A');
            expect(result.precio_sin_impuesto).toBe(1000);
            expect(result.impuesto).toBe(21);
            expect(result.precio_con_impuesto).toBe(1021);
            expect(result.stock).toBe(10);
            // expect(result.marca).toBe('MarcaX');
            // expect(result.marca.nombre).toBe(undefined)
            // expect(result.linea).toBe('LíneaY');
            // expect(result.linea.nombre).toBe(undefined);
            // expect(result.proveedores.length).toBe(2);
            // expect(result.proveedores[0].nombre).toBe('Proveedor1');
            // expect(result.proveedores[1].nombre).toBe('Proveedor2');
            // expect(result.proveedores[0].precio_proveedor).toBe(950);
            // expect(result.proveedores[1].precio_proveedor).toBe(940);
            // expect(result.proveedores[0].codigo_proveedor).toBe('12345678');
            // expect(result.proveedores[1].codigo_proveedor).toBe('12345338');
            // expect(result.proveedores[0].cuit).toBe(undefined);
            // expect(result.proveedores[1].cuit).toBe(undefined);
            // expect(result.proveedores[0].direccion).toBe(undefined);
            // expect(result.proveedores[1].direccion).toBe(undefined);
            // expect(result.proveedores[0].createdAt).toBe(undefined);
            // expect(result.proveedores[1].createdAt).toBe(undefined);
            // expect(result.proveedores[0].updatedAt).toBe(undefined);
            // expect(result.proveedores[1].updatedAt).toBe(undefined);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });


    // --- Disminuir stock correctamente ---
    test('Disminuir el stock de un producto', ({ given, when, then }) => {
        // const producto = { id: 1, stock: 10 } as Producto;

        given('un producto existente con id 1 y stock 10', () => {
            // mockRepo.decreaseStock.mockResolvedValue({ ...producto, stock: 7 } as Producto);
        });


        when('disminuyo el stock en 3 unidades', async () => {
            result = await service.decreaseStock(1, 3);
        });

        then('el stock final debería ser 7', () => {
            expect(result.id).toBe(1);
            expect(result.stock).toBe(7);
            expect(result.nombre).toBe('Monitor Gamer');
            expect(result.descripcion).toBe('Descripción del producto A');
            expect(result.precio_sin_impuesto).toBe(1000);
            expect(result.impuesto).toBe(21);
            expect(result.precio_con_impuesto).toBe(1021);
            // expect(result.stock).toBe(10);
            expect(result.marca).toBe('MarcaX');
            expect(result.marca.nombre).toBe(undefined)
            expect(result.linea).toBe('LíneaY');
            expect(result.linea.nombre).toBe(undefined);
            expect(result.proveedores.length).toBe(2);
            expect(result.proveedores[0].nombre).toBe('Proveedor1');
            expect(result.proveedores[1].nombre).toBe('Proveedor2');
            expect(result.proveedores[0].precio_proveedor).toBe(950);
            expect(result.proveedores[1].precio_proveedor).toBe(940);
            expect(result.proveedores[0].codigo_proveedor).toBe('12345678');
            expect(result.proveedores[1].codigo_proveedor).toBe('12345338');
            expect(result.proveedores[0].cuit).toBe(undefined);
            expect(result.proveedores[1].cuit).toBe(undefined);
            expect(result.proveedores[0].direccion).toBe(undefined);
            expect(result.proveedores[1].direccion).toBe(undefined);
            expect(result.proveedores[0].createdAt).toBe(undefined);
            expect(result.proveedores[1].createdAt).toBe(undefined);
            expect(result.proveedores[0].updatedAt).toBe(undefined);
            expect(result.proveedores[1].updatedAt).toBe(undefined);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });

    // --- Disminuir stock insuficiente ---
    test('Intentar disminuir stock con cantidad mayor al disponible', ({ given, when, then }) => {
        // const producto = { id: 1, stock: 2 } as Producto;

        given('un producto existente con id 1 y stock 7', () => {
            // mockRepo.decreaseStock.mockImplementation(async (id, cantidad) => {
            //     if (cantidad > producto.stock) {
            //         throw new BadRequestException('Stock insuficiente');
            //     }
            //     return { ...producto, stock: producto.stock - cantidad } as Producto; // 👈 casteo aquí
            // });
        });


        when('intento disminuir el stock en 10 unidades', async () => {
            try {
                result = await service.decreaseStock(1, 10);
            } catch (err) {
                error = err;
            }
        });

        then('debería quedar un stock negativo', () => {
            expect(result.stock).toBe(-3);
            expect(error).toBeNull();
            expect(result.id).toBe(1);
            expect(result.stock).toBe(7);
            expect(result.nombre).toBe('Monitor Gamer');
            expect(result.descripcion).toBe('Descripción del producto A');
            expect(result.precio_sin_impuesto).toBe(1000);
            expect(result.impuesto).toBe(21);
            expect(result.precio_con_impuesto).toBe(1021);
            // expect(result.stock).toBe(10);
            expect(result.marca).toBe('MarcaX');
            expect(result.marca.nombre).toBe(undefined)
            expect(result.linea).toBe('LíneaY');
            expect(result.linea.nombre).toBe(undefined);
            expect(result.proveedores.length).toBe(2);
            expect(result.proveedores[0].nombre).toBe('Proveedor1');
            expect(result.proveedores[1].nombre).toBe('Proveedor2');
            expect(result.proveedores[0].precio_proveedor).toBe(950);
            expect(result.proveedores[1].precio_proveedor).toBe(940);
            expect(result.proveedores[0].codigo_proveedor).toBe('12345678');
            expect(result.proveedores[1].codigo_proveedor).toBe('12345338');
            expect(result.proveedores[0].cuit).toBe(undefined);
            expect(result.proveedores[1].cuit).toBe(undefined);
            expect(result.proveedores[0].direccion).toBe(undefined);
            expect(result.proveedores[1].direccion).toBe(undefined);
            expect(result.proveedores[0].createdAt).toBe(undefined);
            expect(result.proveedores[1].createdAt).toBe(undefined);
            expect(result.proveedores[0].updatedAt).toBe(undefined);
            expect(result.proveedores[1].updatedAt).toBe(undefined);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });

    // // --- Listado avanzado ---
    // Scenario: Listado avanzado de productos
    // Given que existen múltiples productos con distintas marcas y líneas
    // When solicito un listado avanzado con filtros
    // Then debería recibir una lista filtrada correctamente

    // test('Listado avanzado de productos', ({ given, when, then }) => {
    //     const productosFiltrados = [
    //         { id: 2, nombre: 'Mouse Logitech' },
    //         { id: 3, nombre: 'Teclado Redragon' },
    //     ];

    //     given('que existen múltiples productos con distintas marcas y líneas', () => {
    //         const productosFiltrados = [
    //             { id: 1, nombre: 'Producto A' },
    //             { id: 2, nombre: 'Producto B' },
    //         ] as unknown as Producto[]; // 👈 cast seguro para tests

    //         mockRepo.advancedList.mockResolvedValue([productosFiltrados, 2]);
    //     });


    //     when('solicito un listado avanzado con filtros', async () => {
    //         result = await mockRepo.advancedList({ marca: 'Logitech' });
    //     });

    //     then('debería recibir una lista filtrada correctamente', () => {
    //         expect(result[0].length).toBe(2);
    //         expect(result[0][0].nombre).toContain('Producto A');
    //     });
    // });

        // --- Eliminar un producto ---
    test('Eliminar un producto existente', ({ given, when, then }) => {
        given('un producto existente con id 1', () => {
            const res = mockRepo.findById(1);
            if(!res) throw new Error('Producto mock no encontrado');
        });

        when('elimino el producto mediante softDelete', async () => {
            result = await service.remove(1);
        });

        then('debería confirmar que el producto se eliminó correctamente', () => {
            expect(result).toStrictEqual({message: 'El producto Monitor Gamer con id 1 fue eliminado exitosamente.'});
            expect(service.findOne(1)).rejects.toThrow('Producto no encontrado');
        });
    });
});
