# Access Finland MVP - Deployment

The Access Finland MVP is a web application created with nextjs and react. It is deployed as a docker container that's run in AWS ECS (Elastic Container Service) as a Fargate task. The whole deployment is automated with Github Actions and pulumi (Infrastructure as Code) tools. The deployment also includes the creation of domain name and SSL certificate in AWS Route53 and Certificate Manager, when enabled. 

The pulumi project for the af-mvp app is located at [../infra/af-mvp/](../infra/af-mvp/).

## Initial deployment with custom domain name

The custom domain name configuration involves a circular dependency between the domain name references to the resources that require the domain name (eg. Cloudfront requires a certificate, that requires a domain name, that requires a Cloudfront distribution origin name, which is not created until the initial deployment). This is solved by doing the initial deployment without the domain name, and then doing a second deployment with the domain name enabled.

The second initial deployment will fail until the created SSL certificates are validated by AWS. This can take some time (should be below 30 minutes). After the certificates are validated, the deployment can be run again (the third initial deployment) and it should then finally succeed.

If the initial deployments are ran with CI/CD pipeline the second deployment is done automatically after the first one and should fail in the step named "Initial deployment domain check". The third deployment is not done automatically and needs to be done manually after the certificates are validated.

So in summary the initial deployment with custom domain name enabled requires three deployments:
- Initial deployment without custom domain name
- Initial deployment with custom domain name (will fail):
  - Creates the SSL certificates and domain names
- Initial deployment with custom domain name (should succeed):
  - Installs the SSL certificates and domain names to the resources that require them

After the initial deployments, any futute deployments can be done normally.

## AWS Cognito credentials after initial deployment

With default settings, the initial deployment will create a new AWS Cognito user and identity pool but no users. To add new users, with [AWS Cognito Console](https://eu-north-1.console.aws.amazon.com/cognito/v2/idp/user-pools), navigate to the Cognito user pools, select the pool with the name that contains the word `wafUserPool` and create users from there.