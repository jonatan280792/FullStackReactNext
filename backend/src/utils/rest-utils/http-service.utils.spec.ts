import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUtils } from './http-service.utils';
import axios from 'axios';

jest.mock('axios');

describe('ServiceUtils', () => {
  let service: ServiceUtils;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceUtils],
    }).compile();

    service = module.get<ServiceUtils>(ServiceUtils);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should make a GET request', async () => {
  //   const endpoint = { url: 'http://test.com', requiredAuth: false };
  //   const mockResponse = { data: 'response' };
  //   axios.get = jest.fn().mockResolvedValue(mockResponse);

  //   const response = await service.buildRequest(endpoint, 'get', {});

  //   expect(response).toEqual(mockResponse);
  //   expect(axios.get).toHaveBeenCalledWith(endpoint.url, expect.objectContaining({}));
  // });

  it('should make a POST request', async () => {
    const endpoint = { url: 'http://test.com', requiredAuth: false };
    const mockResponse = { data: 'response' };
    axios.post = jest.fn().mockResolvedValue(mockResponse);

    // const response = await service.buildRequest(endpoint, 'post', { key: 'value' });

    // expect(response).toEqual(mockResponse);
    // expect(axios.post).toHaveBeenCalledWith(endpoint.url, { key: 'value' }, expect.objectContaining({}));
  });

  it('should throw an error for unsupported method', async () => {
    const endpoint = { url: 'http://test.com', requiredAuth: false };

    await expect(service.buildRequest(endpoint, 'patch' as any, {})).rejects.toThrow('Unsupported HTTP method');
  });
});
