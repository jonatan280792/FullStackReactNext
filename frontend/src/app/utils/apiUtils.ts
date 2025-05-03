// src/utils/apiUtils.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create();

export const buildRequest = async (
  endpoint: any,
  method: 'get' | 'post' | 'put' | 'delete',
  data?: any,
  isTextResponse: boolean = false
): Promise<AxiosResponse> => {  // Añadido el tipo de retorno AxiosResponse
  let headers: Record<string, string> = {};

  if (endpoint.requiredAuth) {
    headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
  }

  if (endpoint.removeContentType) {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }

  const options: AxiosRequestConfig = {
    headers,
    params: method === 'get' ? data : undefined,
    responseType: isTextResponse ? 'text' : 'json',  // Aquí el tipo es 'text' o 'json'
  };

  try {
    switch (method) {
      case 'delete':
        return await axiosInstance.delete(endpoint.url, options);
      case 'get':
        return await axiosInstance.get(endpoint.url, options);
      case 'post':
        return await axiosInstance.post(endpoint.url, data, options);
      case 'put':
        return await axiosInstance.put(endpoint.url, data, options);
      default:
        throw new Error('Unsupported HTTP method');
    }
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;
  }
};
