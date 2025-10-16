import { defineFeature, loadFeature } from 'jest-cucumber';
import { ClienteService } from '../../../src/cliente/cliente.service';
import { ClienteRepository } from '../../../src/cliente/cliente.repository';
import { logStep } from '../logStep';

// Cargar el feature
const feature = loadFeature('./test/bdd/features/profile-update.feature');

defineFeature(feature, test => {
  let clienteService: ClienteService;
  let clienteRepositoryMock: jest.Mocked<ClienteRepository>;
  let result: any;

  beforeEach(() => {
    clienteRepositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<ClienteRepository>;

    clienteService = new ClienteService(clienteRepositoryMock);
  });

  test('El usuario actualiza su información de contacto correctamente', ({ given, when, then }) => {
    given(
      /^existe un cliente con id (\d+), nombre "([^"]*)" y teléfono "([^"]*)"$/,
      (id: string, nombre: string, telefono: string) => {
        logStep(`Given existe un cliente con id ${id}, nombre "${nombre}" y teléfono "${telefono}"`);
        const baseCliente = {
          id: +id,
          nombre,
          apellido: 'Apellido',
          telefono,
          num_documento: '12345678',
          tipo_documento: { id: 1, nombre: 'DNI' },
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;

        clienteRepositoryMock.findOne.mockResolvedValue(baseCliente);
        clienteRepositoryMock.update.mockImplementation(async (_id, data) => ({ ...baseCliente, ...data } as any));
      },
    );

    when(
      /^actualizo el nombre a "([^"]*)" y el teléfono a "([^"]*)" para el cliente (\d+)$/,
      async (nuevoNombre: string, nuevoTelefono: string, id: string) => {
        logStep(`When actualizo el nombre a "${nuevoNombre}" y el teléfono a "${nuevoTelefono}" para el cliente ${id}`);
        result = await clienteService.update(+id, {
          nombre: nuevoNombre,
          telefono: nuevoTelefono,
        } as any);
      },
    );

    then(/^el servicio debe devolver el nombre "([^"]*)" y el teléfono "([^"]*)"$/, (nombre: string, telefono: string) => {
      logStep(`Then el servicio debe devolver el nombre "${nombre}" y el teléfono "${telefono}"`);
      expect(result.nombre).toBe(nombre);
      expect(result.telefono).toBe(telefono);
      expect(clienteRepositoryMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
