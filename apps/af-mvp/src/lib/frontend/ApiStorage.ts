import { KeyValueStorageInterface } from 'aws-amplify/utils';
import { AxiosInstance } from 'axios';
import apiClient from '@shared/lib/api/api-client';

export class ApiStorage implements KeyValueStorageInterface {
  private apiClient: AxiosInstance;
  private endpoint: string;
  private cache: Record<string, string> = {};

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.apiClient = apiClient;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.cache[key] = value;
    await this.apiClient.post(this.endpoint, { action: 'set', key, value });
  }
  async getItem(key: string): Promise<string | null> {
    if (typeof this.cache[key] !== 'undefined') {
      return this.cache[key];
    }
    const response = await this.apiClient.post(this.endpoint, {
      action: 'get',
      key,
    });
    return response.data.value;
  }
  async removeItem(key: string): Promise<void> {
    delete this.cache[key];
    await this.apiClient.post(this.endpoint, { action: 'remove', key });
  }
  async clear(): Promise<void> {
    this.cache = {};
    await this.apiClient.post(this.endpoint, { action: 'clear' });
  }
}
