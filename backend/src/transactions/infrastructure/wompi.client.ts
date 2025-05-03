import { HttpException, Injectable } from '@nestjs/common';
import { ServiceUtils } from '@utils/rest-utils/http-service.utils'
import { ServicesRoutes } from '@utils/rest-utils/service-routes';
import { buildRoute } from '@utils/rest-utils/route-builder.utils';
import { err } from '@shared/result';

@Injectable()
export class WompiClient {
  constructor(private serviceUtils: ServiceUtils) {}

  async getMerchantInfo(): Promise<any> {
    try {
      const response = await this.serviceUtils.buildRequest(
        buildRoute(ServicesRoutes.loginMerchants, {
          secretKey: process.env.SECRET_KEY || '',
        }),
        'get',
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      return err(errorMessage, 404);
    }
  }

  async createTransaction(data: any) {
    try {
      const response = await this.serviceUtils.buildRequest(ServicesRoutes.setTransactions, 'post', data);

      return response.data;
    } catch (error) {
      return err(error.response?.data?.error, 404);
    }
  }
}
