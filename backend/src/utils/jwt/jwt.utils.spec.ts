import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtUtils } from './jwt.utils'; // Ajusta la ruta si es necesario
import { UserEntity } from '../../users/domain/user.entity'; // Ajusta la ruta si es necesario

describe('JwtUtils', () => {
  let jwtUtils: JwtUtils;
  let jwtService: JwtService;

  // Mock del JwtService
  const jwtServiceMock = {
    sign: jest.fn(), // Mock del método 'sign' del JwtService
  };

  // Configuración del testing module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtUtils, // El servicio que queremos testear
        { provide: JwtService, useValue: jwtServiceMock }, // Proveemos un mock de JwtService
      ],
    }).compile();

    jwtUtils = module.get<JwtUtils>(JwtUtils); // Obtenemos la instancia de JwtUtils
    jwtService = module.get<JwtService>(JwtService); // Obtenemos la instancia de JwtService (mock)
  });

  it('should be defined', () => {
    expect(jwtUtils).toBeDefined(); // Verifica que JwtUtils esté definido correctamente
  });

  describe('generateToken', () => {
    it('should call JwtService.sign with the correct payload', () => {
      const user: UserEntity = {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', // Usamos un UUID de ejemplo
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      } as UserEntity; // Creamos un usuario mock (siguiendo la estructura de UserEntity)

      const payload = { sub: user.id, email: user.email }; // Payload esperado

      jwtUtils.generateToken(user); // Llamamos al método 'generateToken' de JwtUtils

      expect(jwtServiceMock.sign).toHaveBeenCalledWith(payload); // Verificamos que JwtService.sign haya sido llamado con el payload correcto
    });

    it('should return a signed token', () => {
      const user: UserEntity = {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', // Usamos un UUID de ejemplo
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      } as UserEntity; // Creamos un usuario mock
      const token = 'signed-token'; // Definimos un token mock
      jwtServiceMock.sign.mockReturnValue(token); // Simulamos que JwtService.sign devuelve un token

      const result = jwtUtils.generateToken(user); // Llamamos a generateToken

      expect(result).toBe(token); // Verificamos que el resultado sea el token simulado
    });
  });
});
