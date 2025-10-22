import { defineFeature, loadFeature } from 'jest-cucumber';
import { NotFoundException } from '@nestjs/common';
import { ProveedorService } from 'src/proveedor/proveedor.service';
import { IProveedorRepository } from 'src/proveedor/interface/IProveedorRepository';
import { Proveedor } from 'src/proveedor/entities/proveedor.entity';
import { UpdateProveedorDto } from 'src/proveedor/dto/update-proveedor.dto';
import { CreateProveedorDto } from 'src/proveedor/dto/create-proveedor.dto';

const feature = loadFeature('./test/bdd/features/proveedores.feature');

defineFeature(feature, (test) => {
    let service: ProveedorService;
    let mockRepo: jest.Mocked<IProveedorRepository>;
    let result: any;
    let error: any;
    let mockProveedorDbRes: any = {
        id: 1,
        nombre: 'Samsung',
        direccion: 'Direccion Proveedor1',
        cuit: '20123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };

    beforeEach(() => {
        mockRepo = {
            findAll: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    nombre: 'Samsung',
                    direccion: 'Direccion Proveedor1',
                    cuit: '20123456789',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                } as Proveedor,
                {
                    id: 2,
                    nombre: 'Apple',
                    direccion: 'Direccion Proveedor2',
                    cuit: '20123466789',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    deletedAt: null,
                } as Proveedor,
            ]),
            findById: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockProveedorDbRes.deletedAt === null) {
                    return mockProveedorDbRes
                }
                return null;
            }),
            create: jest.fn().mockImplementation(async (dto: CreateProveedorDto) => {
                let proveedor = new Proveedor();
                proveedor.id = 1
                proveedor.createdAt = new Date();
                const response = Object.assign(proveedor, dto);
                return response
            }),
            update: jest.fn().mockImplementation(async (id: number, dto: UpdateProveedorDto) => {
                if (id === 1) {
                    dto.updatedAt = new Date('2025-10-22T04:35:28.285Z');
                    const response = Object.assign(mockProveedorDbRes, dto);
                    return response
                }
                return null;
            }),
            softDelete: jest.fn().mockImplementation(async (id: number) => {
                if (id === 1 && mockProveedorDbRes.deletedAt === null) {
                    mockProveedorDbRes.deletedAt = new Date();
                    return true;
                }
                return false;
            })
        };

        service = new ProveedorService(
            mockRepo as any,
        );

        result = null;
        error = null;
    });


    // --- Crear un proveedor ---
    test('Crear un proveedor', ({ given, when, then }) => {
        let nuevoProveedor: any;

        given('un nuevo proveedor válido', () => {

            nuevoProveedor = {
                nombre: 'Samsung',
                direccion: 'Direccion Proveedor1',
                cuit: '20123456789',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }
        });

        when('lo creo mediante create', async () => {
            result = await service.create(nuevoProveedor);
        });

        then('debería recibir el proveedor creado con los datos correctos', () => {
            expect(result.id).toBe(1);
            expect(result.nombre).toBe('Samsung');
            expect(result.direccion).toBe('Direccion Proveedor1');
            expect(result.cuit).toBe('20123456789');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBe(undefined);
            expect(result.deletedAt).toBe(undefined);
        });
    });

    test('Obtener todos los proveedores', ({ given, when, then }) => {
        given('que existen proveedores en la base de datos', () => {
            // No hace falta hacer nada, el mockRepo.findAll ya tiene datos resueltos
        });

        when('solicito todos los proveedores mediante findAll', async () => {
            result = await service.findAll();
        });

        then('debería recibir una lista de proveedores mapeados correctamente', () => {
            expect(result.length).toBe(2);

            expect(result[0].id).toBe(1);
            expect(result[0].nombre).toBe('Samsung');
            expect(result[0].direccion).toBe(undefined);
            expect(result[0].cuit).toBe('20123456789');
            expect(result[0].createdAt).toBe(undefined);
            expect(result[0].updatedAt).toBe(undefined);
            expect(result[0].deletedAt).toBe(undefined);

            expect(result[1].id).toBe(2);
            expect(result[1].nombre).toBe('Apple');
            expect(result[1].direccion).toBe(undefined);
            expect(result[1].cuit).toBe('20123466789');
            expect(result[1].createdAt).toBe(undefined);
            expect(result[1].updatedAt).toBe(undefined);
            expect(result[1].deletedAt).toBe(undefined);
        });
    });

    // --- Buscar un proveedor existente ---
    test('Buscar un proveedor por id', ({ given, when, then }) => {

        given('que existe un proveedor con id 1', () => {
            const res = mockRepo.findById(1)
            // console.log('respuesta mock findById:', res);
        });

        when('lo busco mediante findById', async () => {
            result = await service.findOne(1);
            // console.log('resultado de findOne:', result);
        });

        then('debería recibir el proveedor con id 1', () => {
            expect(result.id).toBe(1);
            expect(result.nombre).toBe('Samsung');
            expect(result.direccion).toBe('Direccion Proveedor1');
            expect(result.cuit).toBe('20123456789');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(result.deletedAt).toBe(undefined);
        });
    });


    // --- Buscar un proveedor inexistente ---
    test('Buscar un proveedor inexistente', ({ given, when, then }) => {
        given('que no existe un proveedor con id 999', () => {
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

        then('debería lanzar un error "Proveedor no encontrado"', () => {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe('Proveedor no encontrado');
        });
    });

    // --- Actualizar un proveedor ---
    test('Actualizar un proveedor existente', ({ given, when, then }) => {
        const proveedorActualizado = { id: 1, nombre: 'BGH' } as Proveedor;

        given('un proveedor existente con id 1', () => {
            // mockRepo.update.mockResolvedValue(productoActualizado);
        });

        when('actualizo el proveedor con un nuevo nombre "BGH"', async () => {
            result = await service.update(1, proveedorActualizado);
        });

        then('debería recibir el proveedor actualizado con nombre "BGH"', () => {
            // expect(result.nombre).toBe('Monitor Gamer');
            expect(result.id).toBe(1);
            expect(result.nombre).toBe('BGH');
            expect(result.direccion).toBe('Direccion Proveedor1');
            expect(result.cuit).toBe('20123456789');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toBeInstanceOf(Date);
            expect(result.updatedAt).toStrictEqual(new Date('2025-10-22T04:35:28.285Z'));
            expect(result.deletedAt).toBe(undefined);
            
        });
    });

    // --- Eliminar un proveedor ---
    test('Eliminar un proveedor existente', ({ given, when, then }) => {
        given('un proveedor existente con id 1', () => {
            const res = mockRepo.findById(1);
            if (!res) throw new Error('Proveedor mock no encontrado');
        });

        when('elimino el proveedor mediante softDelete', async () => {
            result = await service.remove(1);
        });

        then('debería confirmar que el proveedor se eliminó correctamente', () => {
            expect(result).toStrictEqual({ message: 'El proveedor BGH con id 1 fue eliminado exitosamente.' });
            expect(service.findOne(1)).rejects.toThrow('Proveedor no encontrado');
        });
    });

    // --- Error al crear un proveedor ---
test('Error al crear un proveedor', ({ given, when, then, and }) => {
  let nuevoProveedor: any;

  given('un nuevo proveedor válido', () => {
    nuevoProveedor = { nombre: 'Sony', direccion: 'Calle 123', cuit: '20111111111' };
  });

  and('el repositorio lanza un error inesperado al crear', () => {
    mockRepo.create.mockRejectedValueOnce(new Error('DB Error'));
  });

  when('lo creo mediante create', async () => {
    try {
      await service.create(nuevoProveedor);
    } catch (err) {
      error = err;
    }
  });

  then('debería lanzar un error "Error al crear el proveedor"', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Error al crear el proveedor');
  });
});


// --- Error al obtener todos los proveedores ---
test('Error al obtener todos los proveedores', ({ given, when, then }) => {
  given('que el repositorio lanza un error inesperado al listar', () => {
    mockRepo.findAll.mockRejectedValueOnce(new Error('DB Error'));
  });

  when('solicito todos los proveedores mediante findAll', async () => {
    try {
      await service.findAll();
    } catch (err) {
      error = err;
    }
  });

  then('debería lanzar un error "Error al obtener los proveedores"', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Error al obtener los proveedores');
  });
});


// --- Error interno al buscar un proveedor por id ---
test('Error interno al buscar un proveedor por id', ({ given, when, then }) => {
  given('que el repositorio lanza un error inesperado al buscar por id', () => {
    mockRepo.findById.mockRejectedValueOnce(new Error('DB Error'));
  });

  when('lo busco mediante findById', async () => {
    try {
      await service.findOne(1);
    } catch (err) {
      error = err;
    }
  });

  then('debería lanzar un error "Error al obtener el proveedor"', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Error al obtener el proveedor');
  });
});


// --- Error al actualizar un proveedor ---

// Scenario: Error al actualizar un proveedor
//   Given un proveedor existente con id 1
//   And el repositorio lanza un error inesperado al actualizar
//   When actualizo el proveedor con un nuevo nombre "BGH"
//   Then debería lanzar un error "Error al actualizar el proveedor"

// test('Error al actualizar un proveedor', ({ given, when, then, and }) => {
//   given('un proveedor existente con id 1', () => {});

//   and('el repositorio lanza un error inesperado al actualizar', () => {
//     mockRepo.update.mockRejectedValueOnce(new Error('DB Error'));
//   });

//   when('actualizo el proveedor con un nuevo nombre "BGH"', async () => {
//     try {
//       await service.update(1, { nombre: 'BGH' });
//     } catch (err) {
//       error = err;
//     }
//   });

//   then('debería lanzar un error "Error al actualizar el proveedor"', () => {
//     expect(error).toBeInstanceOf(Error);
//     expect(error.message).toBe('Error al actualizar el proveedor');
//   });
// });


// --- Error al eliminar un proveedor ---
test('Error al eliminar un proveedor inexistente', ({ given, when, then, and }) => {
  given('un proveedor existente con id 1', () => {});

  and('el repositorio lanza un error inesperado al eliminar', () => {
    mockRepo.softDelete.mockRejectedValueOnce(new Error('DB Error'));
  });

  when('elimino el proveedor mediante softDelete', async () => {
    try {
      await service.remove(1);
    } catch (err) {
      error = err;
    }
  });

  then('debería lanzar un error "Proveedor no encontrado"', () => {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Proveedor no encontrado');
  });
});

});
