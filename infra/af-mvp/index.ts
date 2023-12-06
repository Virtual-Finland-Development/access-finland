import * as automation from '@pulumi/pulumi/automation';
import afMvpStack from './af-mvp-stack';
import Setup, { StaticSetup } from './utils/Setup';

export = async () => {
  const stack = await automation.LocalWorkspace.createOrSelectStack(
    {
      stackName: `${StaticSetup.organizationName}/${StaticSetup.environment}`,
      projectName: StaticSetup.projectName,
      program: async () => {
        return await afMvpStack(new Setup()); // Refresh the setup on every run
      },
    },
    {
      workDir: __dirname, // Magic variable that resolves to the directory of this file
    }
  );

  const stackDeployedOnce = await StaticSetup.IsDeployedOnce();

  // Deploy the stack
  let response = await stack.up({ onOutput: console.info });
  if (!stackDeployedOnce) {
    console.log(
      'Deploying the stack for the second time to ensure all resources are created...'
    );
    response = await stack.up({ onOutput: console.info }); // Run twice to ensure all resources are created
  }

  // Transform the response to a simple object for the pulumi to get it
  return Object.keys(response.outputs).reduce((acc, key) => {
    acc[key] = response.outputs[key].value;
    return acc;
  }, {} as Record<string, string>);
};
