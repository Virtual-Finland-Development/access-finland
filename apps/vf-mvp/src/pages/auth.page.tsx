import { useState } from 'react';
import { Text } from 'suomifi-ui-components';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';
import Loading from '@shared/components/ui/loading';

export default function AuthPage() {
  const [authError] = useState<string | null>(null);

  if (authError) {
    return (
      <div className="min-w-xl max-w-xl">
        <Alert status="error" labelText="Error">
          <div className="flex flex-col gap-3">
            <Text>{authError}</Text>
            <CustomLink href="/">Go to home page</CustomLink>
          </div>
        </Alert>
      </div>
    );
  }

  return <Loading />;
}
