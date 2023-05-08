import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { forwardRef } from 'react';
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbLinkProps,
} from 'suomifi-ui-components';

type CustomLinkProps = LinkProps & BreadcrumbLinkProps;

interface Breadcrumb {
  label: string;
  href: string;
}

const convertLabel = (label: string) => {
  return label
    .replace(/-/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü');
};

const BreadcrumbCustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (props, ref) => {
    const { onClick, href, current, children } = props;

    return (
      <BreadcrumbLink
        href={href}
        onClick={onClick}
        current={current}
        className="capitalize-first"
      >
        {children}
      </BreadcrumbLink>
    );
  }
);

BreadcrumbCustomLink.displayName = 'BreadcrumbCustomLink';

const homeBreadcrumb = { label: 'home', href: '/' };

export default function Breadcrumbs() {
  const router = useRouter();

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          label: path,
          href: '/' + linkPath.slice(0, i + 1).join('/'),
        };
      });

      return [homeBreadcrumb].concat(pathArray);
    }
    return [];
  }, [router]);

  if (['/', '/404'].includes(router.pathname)) {
    return null;
  }

  return (
    <div className="hidden md:block pt-4 mb-4">
      <Breadcrumb aria-label="Breadcrumb">
        {breadcrumbs.map(item => (
          <Link key={item.href} href={item.href} passHref legacyBehavior>
            <BreadcrumbCustomLink href="" current={router.asPath === item.href}>
              {router.query.nationalIdentifier
                ? item.label
                : convertLabel(item.label)}
            </BreadcrumbCustomLink>
          </Link>
        ))}
      </Breadcrumb>
    </div>
  );
}
