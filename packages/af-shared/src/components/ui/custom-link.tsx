import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';
import styled from 'styled-components';
import {
  Link as SuomiFiLink,
  LinkProps as SuomiFiLinkProps,
} from 'suomifi-ui-components';

interface StyledLinkProps {
  $bold?: boolean;
  $base?: boolean;
  disableVisited?: boolean;
  isExternal?: boolean;
}

const StyledLink = styled(SuomiFiLink).attrs<StyledLinkProps>(
  ({ $bold, $base, disableVisited, isExternal }) => ({
    className: `${$bold ? '!font-bold' : ''} ${$base ? '!text-base' : ''} ${
      disableVisited ? 'visited:!text-blue-600' : ''
    }`,
    ...(isExternal && {
      rel: 'noopener noreferrer',
      target: '_blank',
    }),
  })
)<StyledLinkProps>``;

type CustomLinkProps = Omit<SuomiFiLinkProps, 'href'> &
  Omit<NextLinkProps, 'as' | 'passHref' | 'children'> &
  StyledLinkProps;

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    {
      href,
      replace,
      scroll,
      shallow,
      locale,
      $bold,
      $base,
      disableVisited = false,
      children,
      onClick,
      isExternal,
      target = '_self',
    },
    ref
  ) => {
    return (
      <NextLink
        href={href}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        passHref
        legacyBehavior
      >
        <StyledLink
          href=""
          ref={ref}
          $bold={$bold}
          $base={$base}
          disableVisited={disableVisited}
          onClick={onClick}
          isExternal={isExternal}
          target={target}
        >
          {children}
        </StyledLink>
      </NextLink>
    );
  }
);

CustomLink.displayName = 'CustomLink';

export default CustomLink;
