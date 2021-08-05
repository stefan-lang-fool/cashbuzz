import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import CONFIG from '@/config';

export type requestType = (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
export type responseType = (value: AxiosResponse<unknown>) => AxiosResponse<unknown> | Promise<AxiosResponse<unknown>>
export type rejectType = (error: AxiosError) => Promise<false | AxiosResponse<unknown>>;

// Creation of axios instance
const instance = axios.create({
  baseURL: CONFIG.API_URL,
  timeout: CONFIG.HTTP_CLIENT_TIMEOUT,
  headers: {
    'Content-type': 'application/json',
    'x-api-key': CONFIG.API_KEY
  }
});

// Abstract layer of communication with server by http requests
export default {
  request(config: AxiosRequestConfig): AxiosPromise {
    return instance.request(config);
  },

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return instance.get(url, config);
  },

  post(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise {
    return instance.post(url, data, config);
  },

  patch(url: string, data: unknown, config?: AxiosRequestConfig): AxiosPromise {
    return instance.patch(url, data, config);
  },

  put(url: string, data: unknown, config?: AxiosRequestConfig): AxiosPromise {
    return instance.put(url, data, config);
  },

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return instance.delete(url, config);
  },

  addRequestInterceptor(resolve: requestType, reject: rejectType): void {
    instance.interceptors.request.use(resolve, reject);
  },

  addResponseInterceptor(resolve: responseType, reject: rejectType): void {
    instance.interceptors.response.use(resolve, reject);
  }
};
