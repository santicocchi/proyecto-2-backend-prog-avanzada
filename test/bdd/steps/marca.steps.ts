import { loadFeature, defineFeature } from 'jest-cucumber';
import { MarcaService } from 'src/marca/marca.service';
import { CreateMarcaDto } from 'src/marca/dto/create-marca.dto';
import { UpdateMarcaDto } from 'src/marca/dto/update-marca.dto';
import { MarcaMapper } from 'src/marca/interface/marca.mapper';
import { Marca } from 'src/marca/entities/marca.entity';
import { Linea } from 'src/linea/entities/linea.entity';

const feature = loadFeature('./test/bdd/features/marca.feature');

const repoMock: Partial<any> = {
    create: jest.fn(async (dto: CreateMarcaDto): Promise<Marca> => {
        const entity = new Marca();
        entity.id = 1;
        entity.nombre = dto.nombre;
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.deletedAt = null;
        entity.lineas = dto.lineas?.map(id => {
            const linea = new Linea();
            linea.id = id;
            linea.nombre = `Linea ${id}`;
            linea.createdAt = new Date();
            linea.updatedAt = new Date();
            linea.deletedAt = null;
            linea.marcas = [];
            linea.productos = [];
            return linea;
        }) || [];
        entity.productos = [];
        return entity;
    }),

    findAll: jest.fn(async (): Promise<Marca[]> => {
        const entity = new Marca();
        entity.id = 1;
        entity.nombre = 'Adidas';
        entity.lineas = [];
        return [entity];
    }),

    findById: jest.fn(async (id: number): Promise<Marca | null> => {
        if (id !== 1) return null;
        const entity = new Marca();
        entity.id = id;
        entity.nombre = 'Adidas';
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.deletedAt = null;
        entity.lineas = [];
        entity.productos = [];
        return entity;
    }),

    update: jest.fn(async (id: number, dto: UpdateMarcaDto): Promise<Marca | null> => {
        if (id !== 1) return null;
        const entity = new Marca();
        entity.id = id;
        entity.nombre = dto.nombre ?? 'Adidas';
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.deletedAt = null;
        entity.lineas = [];
        entity.productos = [];
        return entity;
    }),

    softDelete: jest.fn(async (id: number): Promise<boolean> => id === 1),

    assignLinea: jest.fn(async () => ({ success: true, message: 'Linea asignada exitosamente' })),
    removeLinea: jest.fn(async () => ({ success: true, message: 'Linea removida exitosamente' })),
};

export { repoMock };


defineFeature(feature, test => {
    let service: MarcaService;
    let response: any;

    beforeAll(() => {
        jest.spyOn(MarcaMapper, 'toCreateResponse').mockImplementation(x => ({ id: x.id, nombre: x.nombre, createdAt: x.createdAt, lineas: x.lineas }));
        jest.spyOn(MarcaMapper, 'toListResponse').mockImplementation(xs => xs.map(x => ({ id: x.id, nombre: x.nombre, lineas: x.lineas })));
        jest.spyOn(MarcaMapper, 'toResponse').mockImplementation(x => ({
            id: x.id,
            nombre: x.nombre,
            lineas: x.lineas?.map(l => ({ id: l.id, nombre: l.nombre })) || [],
            createdAt: x.createdAt ?? new Date(),
            updatedAt: x.updatedAt ?? new Date(),
        }));
        jest.spyOn(MarcaMapper, 'toDeleteResponse').mockImplementation(x => ({ message: `La Marca ${x.nombre} con id ${x.id} fue eliminada exitosamente.` }));

        service = new MarcaService(repoMock as any);
    });

    test('Crear una marca', ({ given, when, then }) => {
        let dto: CreateMarcaDto;

        given(/^que quiero crear una marca con nombre "(.*)"$/, nombre => {
            dto = { nombre };
        });

        when('la creo mediante create', async () => {
            response = await service.create(dto);
        });

        then(/^debería recibir un objeto con nombre "(.*)"$/, nombre => {
            expect(response.nombre).toBe(nombre);
            expect(response).toHaveProperty('id');
            expect(response).toHaveProperty('createdAt');
        });
    });

    test('Listar todas las marcas', ({ given, when, then }) => {
        given('que existen marcas en la base de datos', () => { });

        when('las solicito mediante findAll', async () => {
            response = await service.findAll();
        });

        then('debería recibir un listado de marcas', () => {
            expect(response).toEqual([{
                id: 1, nombre: 'Adidas', lineas: [],
            }]);
        });
    });

    test('Obtener una marca por id', ({ given, when, then }) => {
        given('que existe una marca con id 1', () => { });

        when('la solicito mediante findOne con id 1', async () => {
            response = await service.findOne(1);
        });

        then('debería recibir la marca con id 1', () => {
            expect(response.id).toBe(1);
            expect(response.nombre).toBe('Adidas');
        });
    });

    test('Actualizar una marca', ({ given, when, then }) => {
        let dto: UpdateMarcaDto;

        given('que existe una marca con id 1', () => { });

        when(/^actualizo la marca con nombre "(.*)" mediante update$/, nombre => {
            dto = { nombre, updatedAt: new Date() };
            response = service.update(1, dto);
        });

        then(/^debería recibir la marca actualizada con nombre "(.*)"$/, nombre => {
            return expect(response).resolves.toHaveProperty('nombre', nombre);
        });
    });

    test('Eliminar una marca', ({ given, when, then }) => {
        given('que existe una marca con id 1', () => { });

        when('elimino la marca mediante remove', async () => {
            response = await service.remove(1);
        });

        then('debería recibir confirmación de eliminación', () => {
            expect(response).toHaveProperty('message', 'La Marca Adidas con id 1 fue eliminada exitosamente.');
        });
    });

    test('Asignar línea a una marca', ({ given, when, then }) => {
        given('que quiero asignar la línea 1 a la marca 1', () => { });

        when('asigno la línea mediante assignLinea', async () => {
            response = await service.assignLinea(1, 1);
        });

        then('debería recibir mensaje de éxito', () => {
            expect(response).toHaveProperty('message', 'Linea asignada exitosamente');
        });
    });

    test('Remover línea de una marca', ({ given, when, then }) => {
        given('que quiero remover la línea 1 de la marca 1', () => { });

        when('remuevo la línea mediante removeLinea', async () => {
            response = await service.removeLinea(1, 1);
        });

        then('debería recibir mensaje de éxito', () => {
            expect(response).toHaveProperty('message', 'Linea removida exitosamente');
        });
    });
});
