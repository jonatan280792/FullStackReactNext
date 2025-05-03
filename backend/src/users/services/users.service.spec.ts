import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../infrastructure/user.repository';
import { JwtUtils } from '../../utils/jwt/jwt.utils';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { Result, Ok, Err } from '@shared/result';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepositoryMock: Partial<UserRepository>;
  let jwtUtilsMock: Partial<JwtUtils>;

  beforeEach(async () => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
    };

    jwtUtilsMock = {
      generateToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: userRepositoryMock },
        { provide: JwtUtils, useValue: jwtUtilsMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks después de cada prueba
  });

  describe('login', () => {
    it('should return a token and user data if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123', // Correct password for mock
      };

      const mockToken = 'mock-jwt-token';

      // Simulamos la respuesta de findByEmail
      (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(user);

      // Simulamos la generación de un token con JwtUtils
      (jwtUtilsMock.generateToken as jest.Mock).mockReturnValue(mockToken);

      const result = await usersService.login(loginDto);

      // Usamos match() para manejar el Ok o Err
      result.match(
        (value) => {
          // Verificamos que la respuesta sea la esperada si el resultado es Ok
          expect(value).toEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            token: mockToken,
          });
        },
        () => fail('Expected Ok result, but got an Err') // Fallo si es Err
      );
    });

    it('should return an error if user is not found or password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      // Simulamos que el usuario no existe en la base de datos
      (userRepositoryMock.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await usersService.login(loginDto);

      // Usamos match() para manejar el Ok o Err
      result.match(
        () => fail('Expected Err result, but got an Ok'), // Fallo si es Ok
        (error, statusCode) => {
          // Verificamos que el error y código de estado sean los esperados
          expect(error).toBe('Correo y/o contraseña incorrecta...');
          expect(statusCode).toBe(404);
        }
      );
    });
  });
});
