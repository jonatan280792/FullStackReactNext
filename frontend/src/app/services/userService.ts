import { buildRequest } from '@/app/utils/apiUtils';
import { ServicesRoutes } from '@/app/utils/constants';
import { LoginResponse } from '@/app/interfaces/user';

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const data = { email, password };
    const response = await buildRequest(ServicesRoutes.loginUser, 'post', data);

    console.log('Login exitoso:', response);

    return response.data; // Devuelve la respuesta con los datos del usuario
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};
