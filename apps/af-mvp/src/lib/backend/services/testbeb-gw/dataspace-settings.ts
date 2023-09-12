import { DataProduct } from 'af-shared/src/types';

export const schemaVersion = 'v0.1';

export function getDataProductRoutePath(dataProduct: DataProduct) {
  const stage = process.env.NEXT_PUBLIC_STAGE;
  if (stage === 'mvp-staging') {
    return `${dataProduct}_${schemaVersion}`;
  }
  return `Draft/${dataProduct}`;
}
