import { KeyValueStorageInterface } from 'aws-amplify/utils';
import { AxiosInstance } from 'axios';
import apiClient from '@shared/lib/api/api-client';

export class ApiStorage implements KeyValueStorageInterface {
  private apiClient: AxiosInstance;
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.apiClient = apiClient;
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.apiClient.post(this.endpoint, { action: 'set', key, value });
  }
  async getItem(key: string): Promise<string | null> {
    const response = await this.apiClient.post(this.endpoint, {
      action: 'get',
      key,
    });
    return response.data.value;
  }
  async removeItem(key: string): Promise<void> {
    await this.apiClient.post(this.endpoint, { action: 'remove', key });
  }
  async clear(): Promise<void> {
    await this.apiClient.post(this.endpoint, { action: 'clear' });
  }
}
