import { ReactNode } from 'react';
import styled from 'styled-components';
import { Heading, HeadingProps } from 'suomifi-ui-components';

type SuomiFiBlue = 'light' | 'dark';

const colorVariant = (color: SuomiFiBlue) =>
  color === 'light' ? '!text-suomifi-light' : '!text-suomifi-dark';

interface StyledHeadingProps {
  suomiFiBlue?: SuomiFiBlue;
  $center?: boolean;
}

const StyledHeading = styled(Heading).attrs<StyledHeadingProps>(
  ({ suomiFiBlue, $center }) => ({
    className: `!text-inherit ${$center && '!text-center'} ${
      suomiFiBlue && colorVariant(suomiFiBlue)
    }`,
  })
)<StyledHeadingProps>``;

interface Props extends HeadingProps {
  children: ReactNode;
  suomiFiBlue?: SuomiFiBlue;
  $center?: boolean;
}

export default function CustomHeading(props: Props) {
  const { children, variant, suomiFiBlue, $center } = props;

  return (
    <StyledHeading
      variant={variant}
      suomiFiBlue={suomiFiBlue}
      $center={$center}
    >
      {children}
    </StyledHeading>
  );
}
