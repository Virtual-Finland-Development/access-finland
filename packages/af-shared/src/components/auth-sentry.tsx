import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

interface Props {
  children: ReactNode;
  redirectPath?: string;
}

export default function AuthSentry(props: Props) {
  const { children, redirectPath } = props;
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectPath || '/');
    }
  }, [isAuthenticated, redirectPath, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
