import { buildRequest } from '@/app/utils/apiUtils';
import { ServicesRoutes } from '@/app/utils/constants';
import { Product2Response, ProductResponse } from '@/app/interfaces/product'; // Puedes definir esta interfaz si no la tienes
import { buildRoute } from '../utils/buildRoute';

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await buildRequest(ServicesRoutes.getProducts, 'get');
    console.log('Productos obtenidos:', response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudo obtener la lista de productos');
  }
};

export const getProductById = async (id: string): Promise<Product2Response> => {
  try {
    const response = await buildRequest(buildRoute(ServicesRoutes.getProductById, {
      id: id
    }), 'get');
    console.log('producto obtenido:', response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('No se pudo obtener la lista de productos');
  }
};

export const setTransactions = async (data: any): Promise<Product2Response> => {
  try {
    const response = await buildRequest(ServicesRoutes.setTransactions, 'post', data);
    console.log('producto obtenido:', response);
    return response.data;
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    throw new Error('No se pudo obtener la lista de productos');
  }
};
