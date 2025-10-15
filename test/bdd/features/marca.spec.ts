import { defineFeature, loadFeature } from 'jest-cucumber';
import { MarcaService } from '../../../src/marca/marca.service';

const feature = loadFeature('./test/bdd/marca.feature');

defineFeature(feature, (test) => {
  let marcaService: MarcaService;
  let response: string;

  beforeEach(() => {
    marcaService = new MarcaService();
  });

  test('Crear una nueva marca', ({ when, then }) => {
    when(/^creo una marca con nombre "([^"]*)"$/, (nombre: string) => {
      response = marcaService.create({ nombre });
    });

    then(/^el servicio debe responder "([^"]*)"$/, (expected: string) => {
      expect(response).toBe(expected);
    });
  });
});
