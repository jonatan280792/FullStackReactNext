import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { Result, ok, err } from '@shared/result';

describe('UsersController', () => {
  let controller: UsersController;
  let usersServiceMock: Partial<UsersService>;

  beforeEach(async () => {
    usersServiceMock = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,  // Mock del UsersService
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'testuser@example.com',
        password: 'password123',
      };

      const loginResponse: LoginResponseDto = {
        id: 'user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        token: 'some-token',
      };

      (usersServiceMock.login as jest.Mock).mockResolvedValue(ok(loginResponse));

      const result = await controller.login(loginDto);

      expect(result).toEqual(ok(loginResponse));
    });

    it('should return an error if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'testuser@example.com',
        password: 'wrongpassword',
      };

      const errorMessage = 'Invalid credentials';
      const errorResponse = err(errorMessage, 401);

      (usersServiceMock.login as jest.Mock).mockResolvedValue(errorResponse);

      const result = await controller.login(loginDto);
      expect(result).toEqual(errorResponse);
    });
  });
});
