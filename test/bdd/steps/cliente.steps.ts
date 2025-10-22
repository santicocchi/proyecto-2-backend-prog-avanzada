import { defineFeature, loadFeature } from 'jest-cucumber';
import { ClienteService } from 'src/cliente/cliente.service';
import { IClienteRepository } from 'src/cliente/interface/IClienteRepository';
import { NotFoundException } from '@nestjs/common';
import { Cliente } from 'src/cliente/entities/cliente.entity';

const feature = loadFeature('./test/bdd/features/cliente.feature');

defineFeature(feature, (test) => {
    let service: ClienteService;
    let mockRepository: jest.Mocked<IClienteRepository>;
    let result: any;
    let error: any;

    const clienteEjemplo = Object.assign(new Cliente(), {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        num_documento: '12345678',
        telefono: '555-1234',
        tipo_documento: { nombre: 'DNI' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ventas: [],
    });


    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
        };
        service = new ClienteService(mockRepository);
    });

    test('Crear un cliente', ({ given, when, then }) => {
        given('un nuevo cliente válido', () => {
            mockRepository.create.mockResolvedValue(clienteEjemplo);
        });

        when('lo creo en el servicio', async () => {
            result = await service.create({
                nombre: 'Juan',
                apellido: 'Pérez',
                num_documento: '12345678',
                telefono: '555-1234',
                tipo_documento: 1,
            });
        });

        then('debería obtener el cliente mapeado correctamente', () => {
            expect(result.nombre).toBe('Juan');
            expect(result.tipo_documento).toBe('DNI');
            expect(mockRepository.create).toHaveBeenCalled();
        });
    });

    test('Obtener todos los clientes', ({ given, when, then }) => {
        given('una lista de clientes existentes', () => {
            mockRepository.findAll.mockResolvedValue([clienteEjemplo]);
        });

        when('obtengo todos los clientes', async () => {
            result = await service.findAll();
        });

        then('debería recibir una lista mapeada', () => {
            expect(Array.isArray(result)).toBe(true);
            expect(result[0].nombre).toBe('Juan');
        });
    });

    test('Buscar un cliente existente', ({ given, when, then }) => {
        given('un cliente existente con id 1', () => {
            mockRepository.findOne.mockResolvedValue(clienteEjemplo);
        });

        when('lo busco por id', async () => {
            result = await service.findOne(1);
        });

        then('debería devolver sus datos correctamente', () => {
            expect(result.id).toBe(1);
            expect(result.nombre).toBe('Juan');
        });
    });

    test('Buscar un cliente inexistente', ({ given, when, then }) => {
        given('que no existe un cliente con id 99', () => {
            mockRepository.findOne.mockResolvedValue(null);
        });

        when('lo busco por id', async () => {
            try {
                await service.findOne(99);
            } catch (e) {
                error = e;
            }
        });

        then('debería lanzar un error de "Cliente no encontrado"', () => {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toBe('Cliente no encontrado');
        });
    });

    test('Actualizar un cliente existente', ({ given, when, then }) => {
        given('un cliente existente con id 1', () => {
            mockRepository.update.mockResolvedValue(
                Object.assign(new Cliente(), {
                    ...clienteEjemplo,
                    telefono: '555-4321',
                }),
            );
        });



        when('actualizo sus datos', async () => {
            result = await service.update(1, { telefono: '555-4321' });
        });

        then('debería devolver el cliente actualizado', () => {
            expect(result.telefono).toBe('555-4321');
        });
    });

    test('Eliminar un cliente existente', ({ given, when, then }) => {
        given('un cliente existente con id 1', () => {
            mockRepository.findOne.mockResolvedValue(clienteEjemplo);
        });

        when('lo elimino', async () => {
            result = await service.remove(1);
        });

        then('debería confirmar que se eliminó correctamente', () => {
            expect(result.message).toBe('Cliente eliminado correctamente');
            expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
        });
    });
});
