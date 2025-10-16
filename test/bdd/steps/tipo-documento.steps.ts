import { defineFeature, loadFeature } from 'jest-cucumber';
import { TipoDocumentoService } from 'src/tipo_documento/tipo_documento.service';
import { CreateTipoDocumentoDto } from 'src/tipo_documento/dto/create-tipo_documento.dto';
import { UpdateTipoDocumentoDto } from 'src/tipo_documento/dto/update-tipo_documento.dto';
import { TipoDocumento } from 'src/tipo_documento/entities/tipo_documento.entity';

const feature = loadFeature('./test/bdd/features/tipo-documento.feature');

defineFeature(feature, test => {
  let service: TipoDocumentoService;
  let response: any;
  let dto: CreateTipoDocumentoDto | UpdateTipoDocumentoDto;

  const repoMock: Partial<any> = {
    create: jest.fn(async (data) => {
      const td = new TipoDocumento();
      td.id = 1;
      td.nombre = data.nombre;
      td.createdAt = new Date();
      td.updatedAt = new Date();
      td.deletedAt = null;
      td.clientes = [];
      return td;
    }),
    findAll: jest.fn(async () => {
      const td = new TipoDocumento();
      td.id = 1;
      td.nombre = 'DNI';
      td.createdAt = new Date();
      td.updatedAt = new Date();
      td.deletedAt = null;
      td.clientes = [];
      return [td];
    }),
    findById: jest.fn(async (id: number) => {
      if (id !== 1) return null;
      const td = new TipoDocumento();
      td.id = 1;
      td.nombre = 'DNI';
      td.createdAt = new Date();
      td.updatedAt = new Date();
      td.deletedAt = null;
      td.clientes = [];
      return td;
    }),
    update: jest.fn(async (id: number, data: UpdateTipoDocumentoDto) => {
      const td = new TipoDocumento();
      td.id = id;
      td.nombre = data.nombre ?? 'DNI';
      td.createdAt = new Date();
      td.updatedAt = new Date();
      td.deletedAt = null;
      td.clientes = [];
      return td;
    }),
  };

  beforeAll(() => {
    service = new TipoDocumentoService(repoMock as any);
  });

  test('Crear un tipo de documento', ({ given, when, then }) => {
    given(/^que tengo un nuevo tipo de documento con nombre "(.*)"$/, (nombre) => {
      dto = { nombre };
    });

    when('lo creo mediante el servicio', async () => {
      response = await service.create(dto as CreateTipoDocumentoDto);
    });

    then(/^debería recibir un objeto creado con nombre "(.*)"$/, (nombre) => {
      expect(response).toBeDefined();
      expect(response.nombre).toBe(nombre);
    });
  });

  test('Listar todos los tipos de documento', ({ given, when, then }) => {
    given('que existen tipos de documento en la base de datos', () => {});

    when('los obtengo mediante el servicio', async () => {
      response = await service.findAll();
    });

    then('debería recibir un listado de tipos de documento', () => {
      expect(response).toBeInstanceOf(Array);
      expect(response.length).toBeGreaterThan(0);
    });
  });

  test('Obtener un tipo de documento por id', ({ given, when, then }) => {
    given('que existe un tipo de documento con id 1', () => {});

    when('lo obtengo mediante el servicio', async () => {
      response = await service.findOne(1);
    });

    then('debería recibir el tipo de documento con id 1', () => {
      expect(response).toBeDefined();
      expect(response.id).toBe(1);
    });
  });

  test('Actualizar un tipo de documento', ({ given, when, then }) => {
    given('que existe un tipo de documento con id 1', () => {});

    when(/^actualizo su nombre a "(.*)" mediante el servicio$/, async (nombre) => {
      dto = { nombre, updatedAt: new Date() };
      response = await service.update(1, dto as UpdateTipoDocumentoDto);
    });

    then(/^debería recibir el tipo de documento actualizado con nombre "(.*)"$/, (nombre) => {
      expect(response).toBeDefined();
      expect(response.nombre).toBe(nombre);
    });
  });
});
