import Link from 'next/link';
import { ReactNode } from 'react';
import { LinkProps, RouterLink } from 'suomifi-ui-components';

interface CustomRouterLink extends LinkProps {
  children: ReactNode;
}

export default function CustomRouterLink({
  onClick,
  children,
  href,
}: CustomRouterLink) {
  return (
    <Link href={href} passHref legacyBehavior>
      <RouterLink onClick={onClick} className="!normal-case">
        {children}
      </RouterLink>
    </Link>
  );
}
