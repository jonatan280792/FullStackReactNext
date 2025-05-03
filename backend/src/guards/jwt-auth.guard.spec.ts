import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  const jwtServiceMock = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if token is valid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid_token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jwtServiceMock.verifyAsync.mockResolvedValue({ userId: '123', email: 'test@example.com' });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith('valid_token', { secret: process.env.JWT_SECRET });
  });

  it('should throw an error if no token is provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrowError('No token provided');
  });

  it('should throw an error if token is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid_token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Unauthorized'));

    await expect(guard.canActivate(context)).rejects.toThrowError('Unauthorized');
  });
});
