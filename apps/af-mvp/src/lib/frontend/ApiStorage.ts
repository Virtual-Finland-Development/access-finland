import { KeyValueStorageInterface } from 'aws-amplify/utils';
import { AxiosInstance } from 'axios';
import apiClient from '@shared/lib/api/api-client';

export class ApiStorage implements KeyValueStorageInterface {
  private apiClient: AxiosInstance;
  private endpoint: string;
  private cache: Record<string, string> = {};
  private csrfToken: string | null = null;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.apiClient = apiClient;
  }

  setCsrfToken(csrfToken: string | null) {
    this.csrfToken = csrfToken;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.cache[key] = value;
    await this.request({ action: 'set', key, value });
  }

  async getItem(key: string): Promise<string | null> {
    if (typeof this.cache[key] !== 'undefined') {
      return this.cache[key];
    }
    const response = await this.request({
      action: 'get',
      key,
    });
    return response.data.value;
  }

  async removeItem(key: string): Promise<void> {
    delete this.cache[key];
    await this.request({ action: 'remove', key });
  }

  async clear(): Promise<void> {
    this.cache = {};
    await this.request({ action: 'clear' });
  }

  /**
   * Request helper
   *
   * @param data
   * @param endpoint
   * @returns
   */
  async request(data: any, endpoint: string = this.endpoint) {
    return await this.apiClient.post(endpoint, data, {
      headers: {
        'x-csrf-token': this.csrfToken,
      },
    });
  }
}
