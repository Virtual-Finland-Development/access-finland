import { PasswordlessContextProvider } from 'amazon-cognito-passwordless-auth/react';
import configureSignIn from '../../../lib/frontend/amazon-cognito';
import SignInPage from './components/sign-in-page';

configureSignIn();

export default function SingInPage() {
  return (
    <PasswordlessContextProvider>
      <SignInPage />
    </PasswordlessContextProvider>
  );
}
