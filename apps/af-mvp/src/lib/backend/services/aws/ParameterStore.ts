import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { getRuntimeStage } from '@shared/lib/utils';

const parameterStoreClient = new SSMClient({});
const inMemoryCache: Record<string, string> = {};

// @see: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ssm/classes/getparametercommand.html
export async function getSecretParameter(name: string) {
  try {
    const data = await parameterStoreClient.send(
      new GetParameterCommand({ Name: name, WithDecryption: true })
    );
    if (!data.Parameter || !data.Parameter.Value)
      throw new Error(`Parameter ${name} not found`);
    return data.Parameter.Value;
  } catch (error) {
    if (typeof error.$$metadata !== 'undefined') {
      const { requestId, cfId, extendedRequestId } = error.$$metadata;
      console.error({ requestId, cfId, extendedRequestId });
    }
    throw error;
  }
}

export async function getStagedSecretParameter(name: string) {
  const stage = getRuntimeStage();
  return getSecretParameter(`${stage}_${name}`);
}

export async function getCachingSecretParameter(name: string) {
  if (inMemoryCache[name]) return inMemoryCache[name];
  const value = await getSecretParameter(name);
  inMemoryCache[name] = value;
  return value;
}

export async function getCachingStagedSecretParameter(name: string) {
  const stage = getRuntimeStage();
  return getCachingSecretParameter(`${stage}_${name}`);
}
