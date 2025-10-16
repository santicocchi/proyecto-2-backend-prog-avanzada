import { defineFeature, loadFeature } from 'jest-cucumber';
import { logStep } from '../logStep';

type Marca = { id: number; nombre: string; lineas: string[] };

class CatalogService {
  private marcas: Marca[] = [];
  private idSeq = 1;
  getMarcas() { return this.marcas; }
  createMarca(nombre: string) {
    if (this.marcas.some(m => m.nombre === nombre)) throw new Error('Duplicado');
    const nueva = { id: this.idSeq++, nombre, lineas: [] };
    this.marcas.push(nueva);
    return nueva;
  }
  createLinea(marcaNombre: string, linea: string) {
    const marca = this.marcas.find(m => m.nombre === marcaNombre);
    if (!marca) throw new Error('Marca inexistente');
    if (marca.lineas.includes(linea)) throw new Error('Duplicado');
    marca.lineas.push(linea);
    return linea;
  }
}

const feature = loadFeature('./test/bdd/features/product-brand-line.feature');

defineFeature(feature, test => {
  let catalog: CatalogService;
  let lastMarca: any;
  let lastLinea: any;

  beforeEach(() => {
    catalog = new CatalogService();
    lastMarca = undefined;
    lastLinea = undefined;
  });

  test('Crear una marca inexistente desde el formulario', ({ given, when, then }) => {
    given('un usuario se encuentra en el formulario de producto', () => {
      logStep('Given usuario en formulario producto');
    });

    when(/^escribe una nueva marca "([^"]*)" que no existe$/, (nombre: string) => {
      logStep(`When escribe marca ${nombre}`);
      lastMarca = catalog.createMarca(nombre);
    });

    then(/^la marca "([^"]*)" debe crearse y aparecer en la lista de marcas$/, (nombre: string) => {
      logStep(`Then marca ${nombre} aparece listada`);
      expect(catalog.getMarcas().some(m => m.nombre === nombre)).toBe(true);
    });
  });

  test('Crear una línea inexistente desde el formulario', ({ given, when, then }) => {
    given(/^la marca "([^"]*)" está seleccionada en el formulario$/, (marca: string) => {
      logStep(`Given marca seleccionada ${marca}`);
      catalog.createMarca(marca);
    });

    when(/^escribe una nueva línea "([^"]*)" que no existe dentro de "([^"]*)"$/, (linea: string, marca: string) => {
      logStep(`When escribe línea ${linea} bajo ${marca}`);
      lastLinea = catalog.createLinea(marca, linea);
    });

    then(/^la línea "([^"]*)" debe crearse y aparecer en la lista de líneas de "([^"]*)"$/, (linea: string, marca: string) => {
      logStep(`Then línea ${linea} aparece en ${marca}`);
      const m = catalog.getMarcas().find(m => m.nombre === marca)!;
      expect(m.lineas).toContain(linea);
    });
  });
});
