import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

const StyledButton = styled(Button).attrs({ variant: 'default' })`
  ${props =>
    props.disabled
      ? 'background: rgb(252 165 165) !important'
      : `background: rgb(220 38 38) !important;
      &:hover {
        background-color: rgb(239 68 68) !important;
      }
      `}
`;

interface Props {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function DangerButton(props: Props) {
  const { children, onClick, disabled = false } = props;

  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}
