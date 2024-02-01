import type { DataProduct } from '@/types';
import apiClient from '../api-client';

export function utilizeDataProduct(
  dataProduct: DataProduct,
  inputData?: any,
  dataSource?: string
) {
  return apiClient.post(
    `/api/dataspace/${dataProduct}${dataSource ? `?source=${dataSource}` : ''}`,
    inputData,
    { csrfTokenRequired: true, isTraceable: true }
  );
}
