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
}

const StyledLink = styled(SuomiFiLink).attrs<StyledLinkProps>(
  ({ $bold, $base }) => ({
    className: `${$bold && '!font-bold'} ${$base && '!text-base'}`,
  })
)<StyledLinkProps>``;

type CustomLinkProps = Omit<SuomiFiLinkProps, 'href'> &
  Omit<NextLinkProps, 'as' | 'passHref' | 'children'> &
  StyledLinkProps;

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ href, replace, scroll, shallow, locale, $bold, $base, children }, ref) => {
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
        <StyledLink href="" ref={ref} $bold={$bold} $base={$base}>
          {children}
        </StyledLink>
      </NextLink>
    );
  }
);

CustomLink.displayName = 'CustomLink';

export default CustomLink;
