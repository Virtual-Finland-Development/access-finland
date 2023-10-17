import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button, IconArrowLeft } from 'suomifi-ui-components';

const StyledButton = styled(Button).attrs({
  variant: 'secondaryNoBorder',
  icon: <IconArrowLeft />,
  className: '!px-0',
})`
  &:hover {
    background: transparent !important;
  }
`;

export default function BackButton() {
  const router = useRouter();

  if (
    ['/', '/profile', '/company', '/logged-out', '/404'].includes(router.route)
  ) {
    return null;
  }

  const handleBackClick = () => {
    if (router.route === '/info/about-the-service') {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <div className="block md:hidden px-4 -mb-2">
      <StyledButton onClick={handleBackClick}>BACK</StyledButton>
    </div>
  );
}
