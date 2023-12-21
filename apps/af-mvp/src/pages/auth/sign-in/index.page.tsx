import { PasswordlessContextProvider } from 'amazon-cognito-passwordless-auth/react';
import configureSignIn from '../../../lib/frontend/amazon-cognito';
import SignIn from './components/sign-in';

configureSignIn();

export default function SingInPage() {
  return (
    <PasswordlessContextProvider>
      <SignIn />
    </PasswordlessContextProvider>
  );
}
