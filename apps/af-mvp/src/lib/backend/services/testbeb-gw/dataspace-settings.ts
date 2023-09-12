import { DataProduct } from 'af-shared/src/types';

export const schemaVersion = 'v0.1';

export function getDataProductRoutePath(dataProduct: DataProduct) {
  const stage = process.env.NEXT_PUBLIC_STAGE;
  if (stage === 'mvp-staging' || stage === 'mvp-production') {
    return `${dataProduct}_${schemaVersion}`;
  }

  if (dataProduct.startsWith('test/')) {
    return dataProduct;
  }
  return `Draft/${dataProduct}`;
}
