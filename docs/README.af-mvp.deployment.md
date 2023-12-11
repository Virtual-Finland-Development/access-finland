# Access Finland MVP - Deployment

The Access Finland MVP is a web application created with nextjs and react. It is deployed as a docker container that's run in AWS ECS (Elastic Container Service) as a Fargate task. The whole deployment is automated with Github Actions and pulumi (Infrastructure as Code) tools. The deployment also includes the creation of domain name and SSL-certificate in AWS Route53 and Certificate Manager, when enabled.

The pulumi project for the af-mvp app is located at [../infra/af-mvp/](../infra/af-mvp/).

## Initial Deployment With Custom Domain Name

The custom domain name configuration involves a circular dependency between the domain name references to the resources that require the domain name (eg. Cloudfront requires a certificate, that requires a domain name, that requires a Cloudfront distribution origin name, which is not created until the initial deployment). This is solved by doing the initial deployment three times:

1. without the domain name:
   - creates the resources that require the domain name (Cloudfront distribution, ALB)
2. with the domain name enabled, which will fail:
   - creates the SSL-certificates and domain names
   - the reason the second initial deployment fails is that the created SSL-certificates must be validated by AWS before installing to the needing resources (eg. CloudFront)
   - the certification validation process can take some time (should be below 30 minutes)
3. with the domain name enabled, which will succeed:
   - installs the SSL-certificates and domain names to the resources that require them.

If the initial deployments are ran with CI/CD pipeline (for example with the deployments orchestration tool: [projects](https://github.com/Virtual-Finland-Development/projects)) the second deployment is done automatically after the first one and should fail in the step named `Initial deployment domain check`. The third deployment needs to be done manually only after the related SSL-certificates are validated.

After the initial deployments, any future deployments can be done normally.

### SSL-Certificate Validation Status Inspection

To inspect the validation status of the certificates, navigate to [AWS Certificate Manager](https://console.aws.amazon.com/acm/home) and select the correct certificate by domain name in the correct region depending on the use-case:

- CloudFront:
  - requires a global certificate (region: us-east-1)
  - certificate domain name is `<domain>`
- ALB:
  - requires a regional certificate (region: eu-north-1)
  - certificate domain name is `loadbalancer.<domain>`

..where the `<domain>` is the domain the af-mvp app is deployed to, eg. `accessfinland.com`.

The certificate validation status is shown in the `Status` column. When the status is `Issued` the certificate is ready to be installed to the resources that require it.

## AWS Cognito Credentials After Initial Deployment

With default settings, the initial deployment will create a new AWS Cognito user and identity pool but no users. To add new users, with [AWS Cognito Console](https://eu-north-1.console.aws.amazon.com/cognito/v2/idp/user-pools), navigate to the Cognito user pools, select the pool with the name that contains the word `wafUserPool` and create users from there.
