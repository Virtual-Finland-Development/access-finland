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

export async function getStagedSecretParameter(name: string) {
  const stage = getRuntimeStage();
  return getOverrideableSecretParameter(`${stage}_${name}`);
}

export async function getCachingSecretParameter(name: string) {
  if (inMemoryCache[name]) return inMemoryCache[name];
  const value = await getOverrideableSecretParameter(name);
  inMemoryCache[name] = value;
  return value;
}

export async function getCachingStagedSecretParameter(name: string) {
  const stage = getRuntimeStage();
  return getCachingSecretParameter(`${stage}_${name}`);
}
