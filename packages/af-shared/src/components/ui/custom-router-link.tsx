import Link from 'next/link';
import { ReactNode } from 'react';
import { LinkProps, RouterLink } from 'suomifi-ui-components';

interface CustomRouterLink extends LinkProps {
  children: ReactNode;
  normalCase?: boolean;
}

export default function CustomRouterLink({
  onClick,
  children,
  href,
  normalCase = false,
}: CustomRouterLink) {
  return (
    <Link href={href} passHref legacyBehavior>
      <RouterLink
        onClick={onClick}
        className={normalCase ? '!normal-case' : ''}
      >
        {children}
      </RouterLink>
    </Link>
  );
}
