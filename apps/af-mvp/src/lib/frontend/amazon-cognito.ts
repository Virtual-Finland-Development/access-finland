import { Passwordless } from 'amazon-cognito-passwordless-auth';

function configureSignIn() {
  Passwordless.configure({
    cognitoIdpEndpoint: 'eu-west-1', // you can also use the full endpoint URL, potentially to use a proxy
    clientId: '<client id>',
    userPoolId: '<user pool id>', // optional, only required if you want to use USER_SRP_AUTH
    //storage: localStorage, // Optional, default to localStorage
  });
}

export default configureSignIn;
