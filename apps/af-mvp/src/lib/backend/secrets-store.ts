import { getRuntimeStage } from '@shared/lib/utils';
import { getSecretParameter } from './services/aws/ParameterStore';

const inMemoryCache: Record<string, string> = {};

/**
 * If a secret is defined in the environment, use that instead of fetching from AWS
 *
 * @param name
 * @returns
 */
async function getOverrideableSecretParameter(name: string) {
  const override = process.env[name];
  if (override) return override;
  return getSecretParameter(name);
}

export async function getStagedSecret(name: string) {
  const stage = getRuntimeStage();
  return getOverrideableSecretParameter(`${stage}_${name}`);
}

export async function getCachingSecret(name: string) {
  if (inMemoryCache[name]) return inMemoryCache[name];
  const value = await getOverrideableSecretParameter(name);
  inMemoryCache[name] = value;
  return value;
}

export async function getCachingStagedSecret(name: string) {
  const stage = getRuntimeStage();
  return getCachingSecret(`${stage}_${name}`);
}
