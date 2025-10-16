import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarcaService } from '../../../src/marca/marca.service';
import { IMarcaRepository } from '../../../src/marca/interface/IMarcaRepository';
import { logStep } from '../logStep';

const feature = loadFeature('./test/bdd/features/marca.feature');

defineFeature(feature, test => {
  let marcaService: MarcaService;
  let marcaRepositoryMock: jest.Mocked<IMarcaRepository>;
  let response: any;

  beforeEach(() => {
    marcaRepositoryMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      assignLinea: jest.fn(),
      removeLinea: jest.fn(),
    } as unknown as jest.Mocked<IMarcaRepository>;

    marcaService = new MarcaService(marcaRepositoryMock);
  });

  test('Crear una nueva marca', ({ when, then }) => {
    when(/^creo una marca con nombre "([^"]*)"$/, async (nombre: string) => {
      logStep(`When creo una marca con nombre "${nombre}"`);
      marcaRepositoryMock.create.mockResolvedValue({ id: 1, nombre, createdAt: new Date(), lineas: [] } as any);
      response = await marcaService.create({ nombre } as any);
    });

    then(/^el servicio debe responder "([^"]*)"$/, (expected: string) => {
      logStep(`Then el servicio debe responder "${expected}"`);
      expect(response.nombre).toBe(expected);
    });
  });
});
