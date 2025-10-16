// import { defineFeature, loadFeature } from 'jest-cucumber';
// import { UsersService } from '../../../src/auth/users/users.service';
// import { IUserRepository } from '../../../src/auth/users/iUsersRepository.interface';
// import { JwtService } from '../../../src/auth/jwt/jwt.service';
// import { HttpException } from '@nestjs/common';
// import { logStep } from '../logStep';

// // Cargar el feature
// const feature = loadFeature('./test/bdd/features/user-registration.feature');

// defineFeature(feature, test => {
//   let usersService: UsersService;
//   let userRepositoryMock: jest.Mocked<IUserRepository>;
//   let jwtServiceMock: jest.Mocked<JwtService>;
//   let response: any;
//   let capturedError: any;

//   beforeEach(() => {
//     // Crear mocks limpios para cada ejecución
//     userRepositoryMock = {
//       findAll: jest.fn(),
//       findOneByEmail: jest.fn(),
//       findOneById: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//     } as unknown as jest.Mocked<IUserRepository>;

//     jwtServiceMock = {
//       generateToken: jest.fn().mockReturnValue('token'),
//       refreshToken: jest.fn().mockReturnValue('refresh-token'),
//     } as unknown as jest.Mocked<JwtService>;

//     usersService = new UsersService(jwtServiceMock, userRepositoryMock, {
//       findOneById: jest.fn(),
//     } as any); // roleRepository no se usa en estas pruebas

//     response = undefined;
//     capturedError = undefined;
//   });

//   test('Registro exitoso de un nuevo usuario', ({ given, when, then }) => {
//     given(/^el correo "([^"]*)" no está registrado$/, (email: string) => {
//       logStep(`Given el correo "${email}" no está registrado`);
//       userRepositoryMock.findOneByEmail.mockResolvedValue(null);
//       userRepositoryMock.create.mockImplementation(async data => ({ ...data, id: 1 } as any));
//     });

//     when(
//       /^registro un usuario con nombre "([^"]*)", email "([^"]*)" y contraseña "([^"]*)"$/,
//       async (_nombre: string, email: string, password: string) => {
//         logStep(`When registro un usuario con nombre "${_nombre}", email "${email}" y contraseña "****"`);
//         response = await usersService.register({ email, nombre: _nombre, password } as any);
//       },
//     );

//     then(/^el servicio debe devolver el estado "([^"]*)"$/, (expectedStatus: string) => {
//       logStep(`Then el servicio debe devolver el estado "${expectedStatus}"`);
//       expect(response.status).toBe(expectedStatus);
//       expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
//     });
//   });

//   test('Registro fallido por correo duplicado', ({ given, when, then }) => {
//     given(/^el correo "([^"]*)" ya existe$/, (email: string) => {
//       logStep(`Given el correo "${email}" ya existe`);
//       userRepositoryMock.findOneByEmail.mockResolvedValue({ id: 1, email } as any);
//     });

//     when(
//       /^registro un usuario con nombre "([^"]*)", email "([^"]*)" y contraseña "([^"]*)"$/,
//       async (_nombre: string, email: string, password: string) => {
//         try {
//           logStep(`When intento registrar un usuario duplicado con email "${email}"`);
//           await usersService.register({ email, nombre: _nombre, password } as any);
//         } catch (error) {
//           capturedError = error;
//         }
//       },
//     );

//     then(/^el servicio debe lanzar la excepción "([^"]*)"$/, (expectedMessage: string) => {
//       logStep(`Then el servicio debe lanzar la excepción "${expectedMessage}"`);
//       expect(capturedError).toBeInstanceOf(HttpException);
//       expect(capturedError.message).toBe(expectedMessage);
//     });
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UsersService } from '../../../src/auth/users/users.service';
import { RegisterDTO } from '../../../src/auth/interfaces/register.dto';
import { UserEntity } from '../../../src/auth/users/entities/user.entity';
import { RoleEntity } from '../../../src/auth/role/entities/role.entity';
import { UsersController } from '../../../src/auth/users/users.controller';
import { LoginDTO } from '../../../src/auth/interfaces/login.dto';
import { SetRoleDto } from '../../../src/auth/users/dtos/setrole.dto';
import { JwtService } from '../../../src/auth/jwt/jwt.service';
import { IRoleRepository } from '../../../src/auth/role/IRoleRepository.interface';
import { IUserRepository } from '../../../src/auth/users/iUsersRepository.interface';



describe('UsersController (integration)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  // mocks
  const userRepoMock: Partial<IUserRepository> = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };

  const roleRepoMock: Partial<IRoleRepository> = {
    findOneById: jest.fn(),
  };

  const jwtMock: Partial<JwtService> = {
    generateToken: jest.fn().mockReturnValue('token'),
    refreshToken: jest.fn().mockReturnValue('refresh-token'),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: 'IUserRepository', useValue: userRepoMock },
        { provide: 'IRoleRepository', useValue: roleRepoMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST users/register', () => {
    const dto: RegisterDTO = { email: 'test@example.com', password: 'Aa123456!' };
    return request(app.getHttpServer())
      .post('/users/register')
      .send(dto)
      .expect(201)
      .expect({ status: 'created', idUser: 1 });
  });

  it('/GET users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([{ id: 1, email: 'a@b.com', role: [] }]);
  });

  it('/GET users/me', () => {
    // Mockeamos req.user inyectando un guard falso
    app.use((req, res, next) => {
      req.user = { id: 1, role: [] };
      next();
    });

    return request(app.getHttpServer())
      .get('/users/me')
      .expect(200)
      .expect({ id: 1, role: [] });
  });

  it('/GET users/logout', () => {
    return request(app.getHttpServer())
      .get('/users/logout')
      .expect(200)
      .expect({ message: 'Logout exitoso' });
  });

  it('/POST users/login', () => {
    const dto: LoginDTO = { email: 'test@example.com', password: 'Aa123456!' };
    return request(app.getHttpServer())
      .post('/users/login')
      .send(dto)
      .expect(201)
      .expect(res => {
        expect(res.body.message).toBe('Login exitoso');
        expect(res.body.accessTokenExpiresAt).toBeDefined();
      });
  });

  it('/GET users/refresh-token', () => {
    return request(app.getHttpServer())
      .get('/users/refresh-token')
      .set('Cookie', ['refresh_token=abc'])
      .expect(200)
      .expect(res => {
        expect(res.body.accessTokenExpiresAt).toBeDefined();
      });
  });

  it('/POST users/:id/role', () => {
    const dto: SetRoleDto = { id: 1 };
    return request(app.getHttpServer())
      .post('/users/1/role')
      .send(dto)
      .expect(200)
      .expect(200);
  });

  it('/DELETE users/:userId/role/:roleId', () => {
    return request(app.getHttpServer())
      .delete('/users/1/role/1')
      .expect(200)
      .expect(200);
  });

  it('/GET users/:id/roles', () => {
    return request(app.getHttpServer())
      .get('/users/1/roles')
      .expect(200)
      .expect([{ id: 1, name: 'admin' }]);
  });
});
