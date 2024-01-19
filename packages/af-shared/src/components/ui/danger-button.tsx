import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

const StyledButton = styled(Button).attrs(props => ({
  variant: props.variant,
}))`
  ${({ variant }) => {
    if (variant === 'secondary') {
      return `
        border-color: rgb(220 38 38) !important;
        color: rgb(220 38 38) !important;
        background: #FFF !important;
        &:hover {
          background: linear-gradient(-180deg,hsl(202,7%,93%) 0%,hsla(0,0%,100%,0) 100%) !important;
        }
        &:disabled {
          border-color: hsl(202,7%,67%) !important;
          color: hsl(202,7%,67%) !important;
          background: hsl(212,63%,98%) !important;
        }
      `;
    } else {
      return `
        border-color: rgb(220 38 38) !important;
        background: rgb(220 38 38) !important;
        &:hover {
          background-color: rgb(239 68 68) !important;
        }
        &:disabled {
          background: rgb(252 165 165) !important;
        }
      `;
    }
  }}
`;

interface Props {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'secondary';
}

export default function DangerButton(props: Props) {
  const { children, onClick, disabled = false, variant = 'default' } = props;

  return (
    <StyledButton onClick={onClick} disabled={disabled} variant={variant}>
      {children}
    </StyledButton>
  );
}
