import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './domain/user.entity';
import { UsersService } from './services/users.service';
import { JwtStrategy } from '@utils/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

process.env.JWT_SECRET = 'mock-secret-key';

describe('UsersModule', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule], // Importamos el módulo UsersModule
      providers: [
        JwtStrategy, // Proveemos el mock de JwtStrategy
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
            verify: jest.fn().mockReturnValue({ userId: 1 }),
          },
        },
      ],
    })
      .overrideProvider(getRepositoryToken(UserEntity)) // Sobrescribimos el repositorio de UserEntity
      .useValue(mockUserRepository) // Usamos el repositorio mockeado
      .compile();

    usersService = module.get<UsersService>(UsersService); // Obtenemos la instancia del servicio UsersService
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined(); // Verificamos que el servicio esté definido
  });

  // Puedes agregar más tests aquí según los métodos de UsersService que necesites probar
});
