import { DataProduct } from 'af-shared/src/types';

export const schemaVersion = 'v0.1';

const serviceToolMigrationCrossOverPaths = [
  'Service/Terms/Agreement',
  'Service/Terms/Agreement/Write',
];

export function getDataProductRoutePath(dataProduct: DataProduct) {
  if (dataProduct.startsWith('test/')) {
    return dataProduct;
  }

  const stage = process.env.NEXT_PUBLIC_STAGE;
  if (
    stage === 'mvp-staging' ||
    stage === 'mvp-production' ||
    serviceToolMigrationCrossOverPaths.includes(dataProduct)
  ) {
    return `${dataProduct}_${schemaVersion}`;
  }
  return `draft/${dataProduct}`;
}
