import * as pulumi from '@pulumi/pulumi';
import { generateKeyPair } from '../utils/rsa';

interface KeyPairResourceArgs {
  // Add any input properties you need for your resource
}

class KeyPairResourceProvider implements pulumi.dynamic.ResourceProvider {
  public async create(): Promise<pulumi.dynamic.CreateResult> {
    const keyPair = generateKeyPair();
    // Return the ID of the resource and any outputs you want to expose
    return {
      id: 'key-pair',
      outs: {
        publicKey: pulumi.output(keyPair.publicKey),
        privateKey: pulumi.output(keyPair.privateKey),
      },
    };
  }
}

export class KeyPairResource extends pulumi.dynamic.Resource {
  // Add any properties you want to expose on your resource
  public readonly publicKey!: pulumi.Output<string>;
  public readonly privateKey!: pulumi.Output<string>;

  constructor(
    name: string,
    args: KeyPairResourceArgs = {},
    opts?: pulumi.CustomResourceOptions
  ) {
    super(new KeyPairResourceProvider(), name, args, opts);
  }
}
