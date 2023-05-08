import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

const StyledButton = styled(Button).attrs({
  variant: 'secondaryNoBorder',
  icon: 'arrowLeft',
  className: '!px-0',
})`
  &:hover {
    background: transparent !important;
  }
`;

export default function BackButton() {
  const router = useRouter();

  if (['/', '/profile', '/company'].includes(router.route)) {
    return null;
  }

  return (
    <div className="block md:hidden px-4 -mb-2">
      <StyledButton onClick={() => router.back()}>BACK</StyledButton>
    </div>
  );
}
