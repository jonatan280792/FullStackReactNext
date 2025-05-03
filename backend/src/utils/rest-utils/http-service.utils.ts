import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ServiceUtils {
  private axiosInstance = axios.create({}); // Instancia de Axios sin necesidad de argumentos

  constructor() {}

  // Método para manejar todas las peticiones
  public async buildRequest(
    endpoint: any,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    isTextResponse: boolean = false
  ) {
    let headers: Record<string, string> = {};

    // Agregar token de autorización si es requerido
    if (endpoint.requiredAuth) {
      headers['Authorization'] = 'Bearer ' + process.env.PRV_SECRET_KEY;
    }

    if (endpoint.removeContentType) {
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = 'application/json';
    }

    // Configuración para peticiones GET con parámetros
    const options = {
      headers,
      params: method === 'get' ? data : undefined,
      responseType: isTextResponse ? 'text' : 'json',  // Si es necesario como texto
    };

    // Manejar cada tipo de método HTTP
    switch (method) {
      case 'delete':
        // Los datos deben pasarse en params o directamente como un objeto data en la configuración
        return this.axiosInstance.delete(endpoint.url, {...options });
      case 'get':
        return this.axiosInstance.get(endpoint.url, options);
      case 'post':
        return this.axiosInstance.post(endpoint.url, data, options);
      case 'put':
        return this.axiosInstance.put(endpoint.url, data, options);
      default:
        throw new Error('Unsupported HTTP method');
    }
  }
}
