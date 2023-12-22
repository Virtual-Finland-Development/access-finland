import { PasswordlessContextProvider } from 'amazon-cognito-passwordless-auth/react';
import SignInPage from './components/sign-in-page';

require('../../../lib/frontend/amazon-cognito');

export default function SingInPage() {
  return (
    <PasswordlessContextProvider>
      <SignInPage />
    </PasswordlessContextProvider>
  );
}
