import { defineFeature, loadFeature } from 'jest-cucumber';
import { NotFoundException } from '@nestjs/common';
import { ProveedorService } from 'src/proveedor/proveedor.service';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { UpdateProveedorDto } from 'src/proveedor/dto/update-proveedor.dto';
import { CreateProveedorDto } from 'src/proveedor/dto/create-proveedor.dto';
import { VentaService } from 'src/venta/venta.service';
import { IVentaRepository } from 'src/venta/interface/IVentaRepository';
import { Venta } from 'src/venta/entities/venta.entity';
import { IClienteRepository } from 'src/cliente/interface/IClienteRepository';
import { IFormaPagoRepository } from 'src/forma_pago/interface/IFormaPagoRepository';
import { IUserRepository } from 'src/auth/users/iUsersRepository.interface';
import { DetalleVentaService } from 'src/detalle_venta/detalle_venta.service';
import { DataSource } from 'typeorm';
import { Producto } from 'src/producto/entities/producto.entity';
import { DetalleVenta } from 'src/detalle_venta/entities/detalle_venta.entity';
import { CreateVentaDto } from 'src/venta/dto/create-venta.dto';
import { UpdateVentaDto } from 'src/venta/dto/update-venta.dto';

const feature = loadFeature('./test/bdd/features/venta.feature');

defineFeature(feature, (test) => {
    let service: VentaService;
    let mockRepo: jest.Mocked<IVentaRepository>;
    let mockClienteRepo: jest.Mocked<IClienteRepository>;
    let mockFormaPagoRepo: jest.Mocked<IFormaPagoRepository>;
    let mockUserRepo: jest.Mocked<IUserRepository>;
    let mockDetalleVentaService: jest.Mocked<DetalleVentaService>;
    let mockDataSource: jest.Mocked<DataSource>;
    let result: any;
    let error: any;
    let mockVentaDbRes: any = {
        id: 1,
        fecha_venta: new Date(),
        total: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        cliente: {
            id: 1,
            nombre: 'Pepe',
            apellido: 'Perez',
            num_documento: '12345678',
            telefono: '555-1234',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            tipo_documento: {
                id: 1,
                nombre: 'DNI',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null
            }
        },
        formaPago: {
            id: 1,
            nombre: 'Tarjeta',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        },
        responsable: {
            id: 1,
            email: 'Xb4X2@example.com',
            password: 'Secreta123',
        },
        detallesVenta: [
            {
                id: 1,
                cantidad: 1,
                subtotal: 1000,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                ventas: { id: 1 },
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
                } as Producto,
            } as DetalleVenta,
        ]
    };

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    fecha_venta: new Date('2025-10-22T04:35:28.285Z'),
                    total: 1000,
                    createdAt: new Date('2025-10-22T04:35:28.285Z'),
                    updatedAt: new Date(),
                    deletedAt: null,
                    cliente: {
                        id: 1,
                        nombre: 'Pepe',
                        apellido: 'Perez',
                        num_documento: '12345678',
                        telefono: '555-1234',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                        tipo_documento: {
                            id: 1,
                            nombre: 'DNI',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        }
                    },
                    formaPago: {
                        id: 1,
                        nombre: 'Tarjeta',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                    },
                    responsable: {
                        id: 1,
                        email: 'Xb4X2@example.com',
                        password: 'Secreta123',
                    },
                    detallesVenta: [
                        {
                            id: 1,
                            cantidad: 1,
                            subtotal: 1000,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null,
                            ventas: { id: 1 },
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
                            } as Producto,
                        } as DetalleVenta,
                    ]
                } as Venta,
                {
                    id: 2,
                    fecha_venta: new Date('2025-10-22T04:35:28.288Z'),
                    total: 2000,
                    createdAt: new Date('2025-10-22T04:35:28.288Z'),
                    updatedAt: new Date(),
                    deletedAt: null,
                    cliente: {
                        id: 2,
                        nombre: 'Jorge',
                        apellido: 'Perez',
                        num_documento: '12345688',
                        telefono: '555-1244',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                        tipo_documento: {
                            id: 1,
                            nombre: 'DNI',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        }
                    },
                    formaPago: {
                        id: 2,
                        nombre: 'Efectivo',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                    },
                    responsable: {
                        id: 1,
                        email: 'Xb4X2@example.com',
                        password: 'Secreta123',
                    },
                    detallesVenta: [
                        {
                            id: 2,
                            cantidad: 1,
                            subtotal: 2000,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null,
                            ventas: { id: 1 },
                            producto: {
                                id: 2,
                                nombre: 'Producto B',
                                descripcion: 'Descripción del producto B',
                                precio_sin_impuesto: 2000,
                                impuesto: 21,
                                precio_con_impuesto: 2021,
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
                            } as Producto,
                        } as DetalleVenta,
                    ]
                } as Venta,
            ]),
            findOne: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockVentaDbRes.deletedAt === null) {
                    return mockVentaDbRes
                }
                return null;
            }),
            create: jest.fn().mockImplementation(async (dto: CreateVentaDto) => {
                let venta = new Venta();
                venta.id = 1
                venta.createdAt = new Date();
                const response = Object.assign(venta, dto);
                return response
            }),
            update: jest.fn().mockImplementation(async (id: number, dto: UpdateVentaDto) => {
                if (id === 1) {
                    // dto.updatedAt = new Date('2025-10-22T04:35:28.285Z');
                    const response = Object.assign(mockVentaDbRes, dto);
                    return response
                }
                return null;
            }),
            softDelete: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockVentaDbRes.deletedAt === null) {
                    mockVentaDbRes.deletedAt = new Date();
                    return true;
                }
                return false;
            }),
            findAdvanced: jest.fn(),

            
        };

        service = new VentaService(
            mockRepo as any,
            mockClienteRepo as any,
            mockFormaPagoRepo as any,
            mockUserRepo as any,
            mockDetalleVentaService as any,
            mockDataSource as any
        );

        result = null;
        error = null;
    });


    // --- Crear un venta ---
    test('Crear una venta', ({ given, when, then }) => {
        let nuevaVenta: any;

        given('una nueva venta válida', () => {

            nuevaVenta = {
                id: 1,
                fecha_venta: new Date('2025-10-22T04:35:28.285Z'),
                total: 1000,
                createdAt: new Date('2025-10-22T04:35:28.285Z'),
                updatedAt: new Date(),
                deletedAt: null,
                cliente: {
                    id: 1,
                    nombre: 'Pepe',
                    apellido: 'Perez',
                    num_documento: '12345678',
                    telefono: '555-1234',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                    tipo_documento: {
                        id: 1,
                        nombre: 'DNI',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null
                    }
                },
                formaPago: {
                    id: 1,
                    nombre: 'Tarjeta',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                },
                responsable: {
                    id: 1,
                    email: 'Xb4X2@example.com',
                    password: 'Secreta123',
                },
                detallesVenta: [
                    {
                        id: 1,
                        cantidad: 1,
                        subtotal: 1000,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                        ventas: { id: 1 },
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
                        } as Producto,
                    } as DetalleVenta,
                ]
            }
        });

        when('la creo mediante create', async () => {
            result = await service.create(nuevaVenta);
        });

        then('debería recibir la venta creada con los datos correctos', () => {
            expect(result.id).toBe(1);
            expect(result.fecha).toBeInstanceOf(Date);
            expect(result.fecha).toStrictEqual(new Date('2025-10-22T04:35:28.285Z'));
            expect(result.cliente).toStrictEqual('Pepe Perez');
            expect(result.responsable).toStrictEqual('Xb4X2@example.com');
            expect(result.formaPago).toStrictEqual('Tarjeta');
            expect(result.total).toBe(1000);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.detallesVenta[0].producto).toStrictEqual('Producto A');
            expect(result.detallesVenta[0].descripcion).toStrictEqual('Descripción del producto A');
            expect(result.detallesVenta[0].precio_sin_impuesto).toBe(1000);
            expect(result.detallesVenta[0].precio_impuesto).toBe(21);
            expect(result.detallesVenta[0].cantidad).toBe(1);
            expect(result.detallesVenta[0].subtotal).toBe(1000);
            expect(result.detallesVenta[0].id).toBe(undefined);
            expect(result.detallesVenta[0].ventas).toBe(undefined);
            expect(result.updatedAt).toBe(undefined);
            expect(result.deletedAt).toBe(undefined);
        });
    });

    test('Obtener todas las ventas', ({ given, when, then }) => {
        given('que existen ventas en la base de datos', () => {
            // No hace falta hacer nada, el mockRepo.findAll ya tiene datos resueltos
        });

        when('solicito todas las ventas mediante findAll', async () => {
            result = await service.findAll();
        });

        then('debería recibir una lista de ventas mapeadas correctamente', () => {
            expect(result.length).toBe(2);

            expect(result[0].id).toBe(1);
            expect(result[0].fecha).toBeInstanceOf(Date);
            expect(result[0].fecha).toStrictEqual(new Date('2025-10-22T04:35:28.285Z'));
            expect(result[0].cliente).toStrictEqual('Pepe Perez');
            expect(result[0].responsable).toStrictEqual('Xb4X2@example.com');
            expect(result[0].formaPago).toStrictEqual('Tarjeta');
            expect(result[0].total).toBe(1000);
            expect(result[0].createdAt).toBe(undefined);
            expect(result[0].detallesVenta[0].producto).toBe(undefined);

            expect(result[1].id).toBe(2);
            expect(result[1].fecha).toBeInstanceOf(Date);
            expect(result[1].fecha).toStrictEqual(new Date('2025-10-22T04:35:28.288Z'));
            expect(result[1].cliente).toStrictEqual('Jorge Perez');
            expect(result[1].responsable).toStrictEqual('Xb4X2@example.com');
            expect(result[1].formaPago).toStrictEqual('Efectivo');
            expect(result[1].total).toBe(2000);
            expect(result[1].createdAt).toBe(undefined);
            expect(result[1].detallesVenta[0].producto).toBe(undefined);



        });
    });

    // --- Buscar una venta existente ---
    test('Buscar una venta por id', ({ given, when, then }) => {

        given('que existe una venta con id 1', () => {
            const res = mockRepo.findOne(1)
            // console.log('respuesta mock findById:', res);
        });

        when('la busco mediante findOne', async () => {
            result = await service.findOne(1);
            // console.log('resultado de findOne:', result);
        });

        then('debería recibir la venta con id 1', () => {
            expect(result.id).toBe(1);
            expect(result.fecha).toBeInstanceOf(Date);
            expect(result.fecha).toStrictEqual(new Date('2025-10-22T04:35:28.285Z'));
            expect(result.cliente).toStrictEqual('Pepe Perez');
            expect(result.responsable).toStrictEqual('Xb4X2@example.com');
            expect(result.formaPago).toStrictEqual('Tarjeta');
            expect(result.total).toBe(1000);
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.detallesVenta[0].producto).toStrictEqual('Producto A');
            expect(result.detallesVenta[0].descripcion).toStrictEqual('Descripción del producto A');
            expect(result.detallesVenta[0].precio_sin_impuesto).toBe(1000);
            expect(result.detallesVenta[0].precio_impuesto).toBe(21);
            expect(result.detallesVenta[0].cantidad).toBe(1);
            expect(result.detallesVenta[0].subtotal).toBe(1000);
            expect(result.detallesVenta[0].id).toBe(undefined);
            expect(result.detallesVenta[0].ventas).toBe(undefined);
            expect(result.updatedAt).toBe(undefined);
            expect(result.deletedAt).toBe(undefined);
        });
    });


    // --- Buscar una venta inexistente ---
    test('Buscar una venta inexistente', ({ given, when, then }) => {
        given('que no existe una venta con id 999', () => {
            // mockRepo.findById.mockResolvedValue(null);
        });

        when('la busco mediante findOne', async () => {
            try {
                const res = await service.findOne(999);
                // if (!res) throw new NotFoundException('Producto no encontrado');
            } catch (err) {
                error = err;
            }
        });

        then('debería lanzar un error "Venta no encontrada"', () => {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe('Venta no encontrada');
        });
    });

    // --- Actualizar una venta ---
    //   Scenario: Actualizar una venta existente
    // Given una venta existente con id 1
    // When actualizo la venta con un nuevo responsable "Claudio"
    // Then debería recibir la venta actualizada con responsable "Claudio"
    // test('Actualizar una venta existente', ({ given, when, then }) => {
    //     const ventaActualizada = { id: 1, nombre: 'BGH' } as Proveedor;

    //     given('una venta existente con id 1', () => {
    //         // mockRepo.update.mockResolvedValue(productoActualizado);
    //     });

    //     when('actualizo la venta con un nuevo responsable "Claudio"', async () => {
    //         result = await service.update(1, proveedorActualizado);
    //     });

    //     then('debería recibir la venta actualizada con responsable "Claudio"', () => {
    //         // expect(result.nombre).toBe('Monitor Gamer');
    //         expect(result.id).toBe(1);
    //         expect(result.nombre).toBe('BGH');
    //         expect(result.direccion).toBe('Direccion Proveedor1');
    //         expect(result.cuit).toBe('20123456789');
    //         expect(result.createdAt).toBeInstanceOf(Date);
    //         expect(result.updatedAt).toBeInstanceOf(Date);
    //         expect(result.updatedAt).toStrictEqual(new Date('2025-10-22T04:35:28.285Z'));
    //         expect(result.deletedAt).toBe(undefined);

    //     });
    // });

    // --- Eliminar una venta ---
    test('Eliminar una venta existente', ({ given, when, then }) => {
        given('una venta existente con id 1', () => {
            const res = mockRepo.findOne(1);
            if (!res) throw new Error('Venta mock no encontrada');
        });

        when('elimino la venta mediante softDelete', async () => {
            result = await service.remove(1);
        });

        then('debería confirmar que la venta se eliminó correctamente', () => {
            expect(result).toStrictEqual({ message: 'La venta con id 1 se elimino exitosamente.' });
            expect(service.findOne(1)).rejects.toThrow('Venta no encontrada');
        });
    });
});
