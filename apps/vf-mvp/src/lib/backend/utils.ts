/**
 * Generates a base64-hash string
 *
 * @param objJsonStr
 * @returns
 */
export function generateBase64Hash(objJsonStr: string | any): string {
  if (typeof objJsonStr !== 'string') {
    objJsonStr = JSON.stringify(objJsonStr);
  }
  return Buffer.from(objJsonStr).toString('base64');
}

/**
 * Resolves a base64-hash string
 *
 * @param hash
 * @returns
 */
export function resolveBase64Hash(hash: string): string {
  const buffer = Buffer.from(hash, 'base64');
  return buffer.toString('utf8');
}

/**
 *
 * @param expiresIn
 * @returns Date.toIsoString
 */
export function transformExpiresInToExpiresAt_ISOString(
  expiresIn: number
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
  return new Date(expiresAt * 1000).toISOString();
}
