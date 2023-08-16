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
  isExternal?: boolean;
}

const StyledLink = styled(SuomiFiLink).attrs<StyledLinkProps>(
  ({ $bold, $base, isExternal }) => ({
    className: `${$bold ? '!font-bold' : ''} ${$base ? '!text-base' : ''}`,
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
      children,
      onClick,
      isExternal,
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
          onClick={onClick}
          isExternal={isExternal}
        >
          {children}
        </StyledLink>
      </NextLink>
    );
  }
);

CustomLink.displayName = 'CustomLink';

export default CustomLink;
