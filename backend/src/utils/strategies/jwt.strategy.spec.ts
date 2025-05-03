import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let jwtService: JwtService;

  // Mock de JwtService
  const jwtServiceMock = {
    verifyAsync: jest.fn()
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret'; // El valor que desees
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy, // El servicio que queremos testear
        { provide: JwtService, useValue: jwtServiceMock }, // Proveemos el mock del JwtService
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the userId and email from the payload', async () => {
      const payload = { sub: '12345', email: 'test@example.com' };
      
      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ userId: '12345', email: 'test@example.com' });
    });

    it('should call JwtService.verifyAsync when token is validated', async () => {
      const payload = { sub: '12345', email: 'test@example.com' };

      jwtServiceMock.verifyAsync.mockResolvedValue(payload);

      const result = await jwtStrategy.validate(payload);
      expect(jwtServiceMock.verifyAsync).toMatch;
      expect(result).toEqual({ userId: '12345', email: 'test@example.com' });
    });
  });
});
