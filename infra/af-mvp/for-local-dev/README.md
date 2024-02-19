# Local develpoment environment of virtualfinland authentication service


## Email sending

Before the cognito setup, update the email sending address in the `Pulumi.yaml` file's `ses:fromAddress`-field. 

The email address is used to send the OTP codes to the users and require a working AWS SES (Simple Email Service) setup with the email address domain verified (in the same AWS account as the Cognito User Pool). The SES setup is documented and set up in the [infrastructure](https://github.com/Virtual-Finland-Development/infrastructure/blob/main/Docs/README.email-setup.md) project.


## AWS Cognito User Pool for local development

To setup run the following commands:

```bash
pulumi stack select --create --stack virtualfinland/local
pulumi up
```

Take note of the outputs and copy the values to the local environment variables.
