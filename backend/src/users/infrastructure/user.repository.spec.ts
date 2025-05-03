import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../domain/user.entity';
import { Repository } from 'typeorm';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let repositoryMock: Partial<Repository<UserEntity>>;

  beforeEach(async () => {
    repositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: repositoryMock, // Inyectamos el mock del repositorio
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('findByEmail', () => {
    it('should return a user when the email exists', async () => {
      const email = 'testuser@example.com';
      const user: UserEntity = {
        id: 'user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'hashed-password',
      };

      // Mock de la respuesta del método findOne
      (repositoryMock.findOne as jest.Mock).mockResolvedValue(user);

      const result = await userRepository.findByEmail(email);

      // Verificamos que se haya llamado el método findOne con el email correcto
      expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { email } });

      // Verificamos que la respuesta sea el usuario esperado
      expect(result).toEqual(user);
    });

    it('should return null when the email does not exist', async () => {
      const email = 'nonexistentuser@example.com';

      // Mock de la respuesta del método findOne, simulamos que no existe el usuario
      (repositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail(email);

      // Verificamos que el método findOne haya sido llamado correctamente
      expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { email } });

      // Verificamos que el resultado sea null
      expect(result).toBeNull();
    });
  });
});
