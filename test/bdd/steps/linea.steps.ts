import { loadFeature, defineFeature } from 'jest-cucumber';
import { LineaService } from 'src/linea/linea.service';
import { ILineaRepository } from 'src/linea/interface/ILineaRepository';
import { LineaMapper } from 'src/linea/interface/linea.mapper';
import { CreateLineaDto } from 'src/linea/dto/create-linea.dto';
import { UpdateLineaDto } from 'src/linea/dto/update-linea.dto';
import { Linea } from 'src/linea/entities/linea.entity';

const feature = loadFeature('./test/bdd/features/linea.feature');

defineFeature(feature, test => {
  let service: LineaService;

  // Mock del repository
  const repoMock: Partial<any> = {
  create: jest.fn(async (dto: CreateLineaDto): Promise<Linea> => {
    const entity = new Linea();
    entity.id = 1;
    entity.nombre = dto.nombre;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    entity.deletedAt = null;
    entity.marcas = [];
    entity.productos = [];
    return entity;
  }),

  findAll: jest.fn(async (): Promise<Linea[]> => {
    const entity = new Linea();
    entity.id = 1;
    entity.nombre = 'Electrónica';
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    entity.deletedAt = null;
    entity.marcas = [];
    entity.productos = [];
    return [entity];
  }),

  findById: jest.fn(async (id: number): Promise<Linea | null> => {
    if (id !== 1) return null;
    const entity = new Linea();
    entity.id = id;
    entity.nombre = 'Electrónica';
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    entity.deletedAt = null;
    entity.marcas = [];
    entity.productos = [];
    return entity;
  }),

  update: jest.fn(async (id: number, dto: UpdateLineaDto): Promise<Linea | null> => {
    if (id !== 1) return null;
    const entity = new Linea();
    entity.id = id;
    entity.nombre = dto.nombre ?? 'Electrónica';
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    entity.deletedAt = null;
    entity.marcas = [];
    entity.productos = [];
    return entity;
  }),

  softDelete: jest.fn(async (id: number): Promise<boolean> => {
    if (id !== 1) return false;
    return true;
  }),
};

  // Mock del mapper
 beforeAll(() => {
    jest.spyOn(LineaMapper, 'toCreateResponse').mockImplementation(x => ({ id: x.id, nombre: x.nombre, createdAt: x.createdAt }));
    jest.spyOn(LineaMapper, 'toListResponse').mockImplementation(xs => xs.map(x => ({ id: x.id, nombre: x.nombre })));
    jest.spyOn(LineaMapper, 'toResponse').mockImplementation(x => ({ id: x.id, nombre: x.nombre, marcas: x.marcas, createdAt: x.createdAt, updatedAt: x.updatedAt }));
    jest.spyOn(LineaMapper, 'toUpdateResponse').mockImplementation(x => ({ id: x.id, nombre: x.nombre, updatedAt: x.updatedAt, marcas: x.marcas }));
    jest.spyOn(LineaMapper, 'toDeleteResponse').mockImplementation(x => ({ message: `La Linea ${x.nombre} con id ${x.id} fue eliminada exitosamente.` }));

    service = new LineaService(repoMock as ILineaRepository);
  });

  test('Crear una línea', ({ given, when, then }) => {
    let dto: CreateLineaDto;
    let response: any;

    given(/^que tengo una nueva línea con nombre "(.*)"$/, nombre => {
      dto = { nombre };
    });

    when('la creo mediante create', async () => {
      response = await service.create(dto);
    });

    then(/^debería recibir un objeto creado con nombre "(.*)"$/, nombre => {
      expect(response.nombre).toBe(nombre);
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('createdAt');
    });
  });

  test('Listar todas las líneas', ({ given, when, then }) => {
    let response: any;

    given('que existen líneas en la base de datos', () => {});

    when('las solicito mediante findAll', async () => {
      response = await service.findAll();
    });

    then('debería recibir un listado de líneas', () => {
      expect(response).toEqual([{ id: 1, nombre: 'Electrónica' }]);
    });
  });

  test('Obtener una línea por id', ({ given, when, then }) => {
    let response: any;

    given('que existe una línea con id 1', () => {});

    when('la solicito mediante findOne con id 1', async () => {
      response = await service.findOne(1);
    });

    then('debería recibir la línea con id 1', () => {
      expect(response.id).toBe(1);
      expect(response.nombre).toBe('Electrónica');
    });
  });

  test('Actualizar una línea', ({ given, when, then }) => {
    let dto: UpdateLineaDto;
    let response: any;

    given('que existe una línea con id 1', () => {});

    when(/^actualizo la línea con nombre "(.*)" mediante update$/, nombre => {
      dto = { nombre };
      response = service.update(1, dto);
    });

    then(/^debería recibir la línea actualizada con nombre "(.*)"$/, nombre => {
      return expect(response).resolves.toHaveProperty('nombre', nombre);
    });
  });

  test('Eliminar una línea', ({ given, when, then }) => {
    let response: any;

    given('que existe una línea con id 1', () => {});

    when('elimino la línea mediante remove', async () => {
      response = await service.remove(1);
    });

    then('debería recibir confirmación de eliminación', () => {
      expect(response).toHaveProperty('message', 'La Linea Electrónica con id 1 fue eliminada exitosamente.');
    });
  });

  
  test('Crear una línea con error', ({ given, when, then }) => {
    let dto: CreateLineaDto;
    let error: any;

    given('que el repositorio lanza un error al crear una línea', () => {
      (repoMock.create as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('DB error');
      });
    });

    when(/^intento crear una nueva línea con nombre "(.*)"$/, async nombre => {
      dto = { nombre };
      try {
        await service.create(dto);
      } catch (err) {
        error = err;
      }
    });

    then(/^debería lanzarse un error con mensaje "(.*)"$/, mensaje => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(mensaje);
    });
  });

  test('Listar líneas con error', ({ given, when, then }) => {
    let error: any;

    given('que el repositorio lanza un error al listar las líneas', () => {
      (repoMock.findAll as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('DB error');
      });
    });

    when('intento listar todas las líneas', async () => {
      try {
        await service.findAll();
      } catch (err) {
        error = err;
      }
    });

    then(/^debería lanzarse un error con mensaje "(.*)"$/, mensaje => {
      expect(error.message).toBe(mensaje);
    });
  });

  test('Buscar una línea inexistente', ({ given, when, then }) => {
    let error: any;

    given('que no existe una línea con id 999', () => {
      (repoMock.findById as jest.Mock).mockResolvedValueOnce(null);
    });

    when('intento obtener la línea con id 999', async () => {
      try {
        await service.findOne(999);
      } catch (err) {
        error = err;
      }
    });

    then(/^debería lanzarse un error con mensaje "(.*)"$/, mensaje => {
      expect(error.message).toBe(mensaje);
    });
  });

  test('Actualizar una línea inexistente', ({ given, when, then }) => {
    let dto: UpdateLineaDto;
    let error: any;

    given('que no existe una línea con id 999 para actualizar', () => {
      (repoMock.update as jest.Mock).mockResolvedValueOnce(null);
    });

    when(/^intento actualizar la línea con id 999 con nombre "(.*)"$/, async nombre => {
      dto = { nombre };
      try {
        await service.update(999, dto);
      } catch (err) {
        error = err;
      }
    });

    then(/^debería lanzarse un error con mensaje "(.*)"$/, mensaje => {
      expect(error.message).toBe(mensaje);
    });
  });

  test('Eliminar una línea inexistente', ({ given, when, then }) => {
    let error: any;

    given('que no existe una línea con id 999 para eliminar', () => {
      (repoMock.findById as jest.Mock).mockResolvedValueOnce(null);
    });

    when('intento eliminar la línea con id 999', async () => {
      try {
        await service.remove(999);
      } catch (err) {
        error = err;
      }
    });

    then(/^debería lanzarse un error con mensaje "(.*)"$/, mensaje => {
      expect(error.message).toBe(mensaje);
    });
  });
});
