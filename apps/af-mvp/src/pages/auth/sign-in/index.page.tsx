import { Authenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import SignInPage from './components/sign-in-page';

require('../../../lib/frontend/aws-cognito');

export default function SingInPage() {
  return (
    <Authenticator.Provider>
      <View>
        <SignInPage />
      </View>
    </Authenticator.Provider>
  );
}
