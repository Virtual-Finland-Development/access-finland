import { ReactNode } from 'react';
import styled from 'styled-components';
import Footer from './footer';
import MainNavigation from './main-navigation';

const Container = styled.div.attrs({
  className: 'container flex flex-col h-full flex-1 md:px-4',
})``;

interface Props {
  children: ReactNode;
  navigationItems: { name: string; href: string }[];
}

export default function MainLayout({ children, navigationItems }: Props) {
  return (
    <>
      <MainNavigation navigationItems={navigationItems} />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
