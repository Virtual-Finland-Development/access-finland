import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

interface StyledTextProps {
  $base?: boolean;
  $bold?: boolean;
  $center?: boolean;
}

const StyledText = styled(Text).attrs<StyledTextProps>(
  ({ $bold, $base, $center }) => ({
    className: `${$bold && '!font-bold'} ${$base && '!text-base'} ${
      $center && '!text-center'
    }`,
  })
)<StyledTextProps>`
  color: inherit;
`;

interface Props extends StyledTextProps {
  children: string;
}

export default function CustomText(props: Props) {
  const { children, $bold, $base, $center, ...rest } = props;

  return (
    <StyledText {...rest} $bold={$bold} $base={$base} $center={$center}>
      {children}
    </StyledText>
  );
}
