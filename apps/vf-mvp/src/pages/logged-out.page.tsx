import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { Link, Text } from 'suomifi-ui-components';
import { useAuth } from 'vf-shared/src/context/auth-context';
import Alert from '@shared/components/ui/alert';
import CustomLink from '@shared/components/ui/custom-link';

export default function LoggedOutPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const sinunaLoginServiceLink = 'https://frontend.sunbackend.qa.sinuna.fi';

  const routerActions = useCallback(async () => {
    if (isAuthenticated) {
      router.push('/'); // Redirect to home page if user is logged in
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (router.isReady) {
      routerActions();
    }
  }, [router.isReady, routerActions]);

  return (
    <div className="min-w-xl max-w-xl">
      <Alert
        status="neutral"
        labelText="Logged out from Virtual Finland successfully!"
      >
        <div className="flex flex-col gap-3">
          <Text>
            Logging out from Virtual Finland succeeded. Note that the Sinuna
            login session might still be active.
          </Text>
          <CustomLink href="/">Go to home page</CustomLink>
          <Text>Manage Sinuna login at:</Text>
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href={sinunaLoginServiceLink}
          >
            Sinuna Service
          </Link>
        </div>
      </Alert>
    </div>
  );
}
