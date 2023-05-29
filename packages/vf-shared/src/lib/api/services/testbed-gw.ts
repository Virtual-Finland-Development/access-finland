import { DataProduct } from '@/lib/backend/services/testbeb-gw/data-product-router';
import apiClient from '../api-client';

export function utilizeDataProduct(
  dataProduct: DataProduct,
  inputData?: any,
  dataSource?: string
) {
  return apiClient.post(
    `/api/testbed-gw/${dataProduct}${
      dataSource ? `?source=${dataSource}` : ''
    }`,
    inputData
  );
}
