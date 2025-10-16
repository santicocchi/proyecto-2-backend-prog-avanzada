import { loadFeature, defineFeature } from 'jest-cucumber';
import { FormaPagoService } from 'src/forma_pago/forma_pago.service';
import { FormaPagoRepository } from 'src/forma_pago/forma_pago.repository';
import { FormaPagoMapper } from 'src/forma_pago/helpers/forma_pago.mapper';
import { FormaPago } from 'src/forma_pago/entities/forma_pago.entity';
import { CreateFormaPagoDto } from 'src/forma_pago/dto/create-forma_pago.dto';
import { UpdateFormaPagoDto } from 'src/forma_pago/dto/update-forma_pago.dto';

const feature = loadFeature('./test/bdd/features/forma_pago.feature');

defineFeature(feature, test => {
  let service: FormaPagoService;

  const repoMock: Partial<any> = {
    create: jest.fn(async (dto: CreateFormaPagoDto): Promise<FormaPago> => {
      const entity = new FormaPago();
      entity.id = 1;
      entity.nombre = dto.nombre;
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      entity.deletedAt = null;
      entity.ventas = [];
      return entity;
    }),

    findAll: jest.fn(async (): Promise<FormaPago[]> => {
      const entity = new FormaPago();
      entity.id = 1;
      entity.nombre = 'Tarjeta';
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      entity.deletedAt = null;
      entity.ventas = [];
      return [entity];
    }),

    findOne: jest.fn(async (id: number): Promise<FormaPago> => {
      if (id !== 1) return null; // simula no encontrado
      const entity = new FormaPago();
      entity.id = id;
      entity.nombre = 'Tarjeta';
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      entity.deletedAt = null;
      entity.ventas = [];
      return entity;
    }),

    update: jest.fn(async (id: number, dto: UpdateFormaPagoDto): Promise<FormaPago> => {
      if (id !== 1) return null; // simula no encontrado
      const entity = new FormaPago();
      entity.id = id;
      entity.nombre = dto.nombre ?? 'Tarjeta';
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      entity.deletedAt = null;
      entity.ventas = [];
      return entity;
    }),

    softDelete: jest.fn(async (id: number): Promise<FormaPago> => {
      if (id !== 1) return null; // simula no encontrado
      const entity = new FormaPago();
      entity.id = id;
      entity.nombre = 'Tarjeta';
      entity.createdAt = new Date();
      entity.updatedAt = new Date();
      entity.deletedAt = new Date(); // simula soft delete
      entity.ventas = [];
      return entity;
    }),
  };


  beforeAll(() => {
    // mockeo el mapper para simplificar tests
    jest.spyOn(FormaPagoMapper, 'toCreateResponse').mockImplementation(x => x);
    jest.spyOn(FormaPagoMapper, 'toListResponse').mockImplementation(x => x);
    jest.spyOn(FormaPagoMapper, 'toGetResponse').mockImplementation(x => x);
    jest.spyOn(FormaPagoMapper, 'toUpdateResponse').mockImplementation(x => x);
    jest.spyOn(FormaPagoMapper, 'toDeleteResponse').mockImplementation(x => ({
      message: `La forma de pago ${x.nombre} con id ${x.id} fue eliminada exitosamente`,
      deletedAt: x.deletedAt,
    }));

    service = new FormaPagoService(repoMock as any);
  });

  test('Crear una forma de pago', ({ given, when, then }) => {
    let dto: any;
    let response: any;

    given(/^que tengo una nueva forma de pago con nombre "(.*)"$/, nombre => {
      dto = { nombre };
    });

    when('la creo mediante create', async () => {
      response = await service.create(dto);
    });

    then(/^debería recibir un objeto creado con nombre "(.*)"$/, nombre => {
      expect(response.nombre).toBe(nombre);
    });
  });

  test('Listar todas las formas de pago', ({ given, when, then }) => {
    let response: any;

    given('que existen formas de pago en la base de datos', () => { });

    when('las solicito mediante findAll', async () => {
      response = await service.findAll();
    });

    then('debería recibir un listado de formas de pago', () => {
      expect(response).toEqual([{ id: 1, nombre: 'Tarjeta', 
                                        createdAt: new Date(),
                                        updatedAt : new Date(),
                                        deletedAt : null,
                                        ventas : [] }]);
    });
  });

  test('Obtener una forma de pago por id', ({ given, when, then }) => {
    let response: any;

    given('que existe una forma de pago con id 1', () => { });

    when('la solicito mediante findOne con id 1', async () => {
      response = await service.findOne(1);
    });

    then('debería recibir la forma de pago con id 1', () => {
      expect(response.id).toBe(1);
    });
  });

  test('Actualizar una forma de pago', ({ given, when, then }) => {
    let dto: any;
    let response: any;

    given('que existe una forma de pago con id 1', () => { });

    when(/^actualizo la forma de pago con nombre "(.*)" mediante update$/, nombre => {
      dto = { nombre };
      response = service.update(1, dto);
    });

    then(/^debería recibir la forma de pago actualizada con nombre "(.*)"$/, nombre => {
      expect(response).resolves.toHaveProperty('nombre', nombre);
    });
  });

  test('Eliminar una forma de pago', ({ given, when, then }) => {
    let response: any;

    given('que existe una forma de pago con id 1', () => { });

    when('elimino la forma de pago mediante remove', async () => {
      response = await service.remove(1);
    });

    then('debería recibir confirmación de eliminación', () => {
      expect(response).toHaveProperty('deletedAt');
    });
  });
});
