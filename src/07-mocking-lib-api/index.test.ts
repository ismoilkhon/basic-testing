import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn,
}));

describe('throttledGetDataFromApi', () => {
  const mockData = { id: 1, title: 'test' };
  const relativePath = '/test';

  let mockGet: jest.Mock;
  let axiosCreateSpy: jest.SpyInstance<AxiosInstance>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGet = jest.fn().mockResolvedValue({ data: mockData });

    (axios.create as jest.Mock).mockImplementation(() => ({
      get: mockGet,
    }));

    axiosCreateSpy = jest.spyOn(axios, 'create');
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);

    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);

    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockData);
  });

  test('should throw if request fails', async () => {
    const error = new Error('Network Error');
    mockGet.mockRejectedValueOnce(error);

    await expect(throttledGetDataFromApi(relativePath)).rejects.toThrow(error);
  });
});
